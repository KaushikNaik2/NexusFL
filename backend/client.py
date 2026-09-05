import argparse
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
import flwr as fl
from sklearn.metrics import average_precision_score
from model import FraudMLP, get_weights, set_weights

# Hardware guardrail: Prevent aggressive CPU utilization
torch.set_num_threads(2)

def load_local_data(client_id: str):
    X_train, y_train = torch.load(f"data/{client_id}_train.pt", weights_only=True)
    X_val, y_val = torch.load(f"data/{client_id}_val.pt", weights_only=True)
    train_loader = DataLoader(TensorDataset(X_train, y_train), batch_size=256, shuffle=True)
    val_loader = DataLoader(TensorDataset(X_val, y_val), batch_size=256, shuffle=False)
    return train_loader, val_loader

class FraudClient(fl.client.NumPyClient):
    def __init__(self, cid: str, train_loader, val_loader, device):
        self.cid = cid
        self.train_loader = train_loader
        self.val_loader = val_loader
        self.device = device
        self.model = FraudMLP().to(self.device)
        self.criterion = nn.BCELoss()
        self.optimizer = torch.optim.Adam(self.model.parameters(), lr=0.001)

    def get_parameters(self, config):
        return get_weights(self.model)

    def fit(self, parameters, config):
        set_weights(self.model, parameters)
        self.model.train()
        epochs = config.get("local_epochs", 1)

        for _ in range(epochs):
            for X, y in self.train_loader:
                X, y = X.to(self.device), y.to(self.device)
                self.optimizer.zero_grad()
                loss = self.criterion(self.model(X), y)
                loss.backward()
                self.optimizer.step()

        return get_weights(self.model), len(self.train_loader.dataset), {}

    def evaluate(self, parameters, config):
        set_weights(self.model, parameters)
        self.model.eval()

        all_preds = []
        all_targets = []

        with torch.no_grad():
            for X, y in self.val_loader:
                X = X.to(self.device)
                preds = self.model(X)
                all_preds.extend(preds.cpu().numpy())
                all_targets.extend(y.numpy())

        # Business Threshold Setup
        threshold = 0.15 # Tuned for higher recall
        y_probs = torch.tensor(all_preds).squeeze()
        y_true = torch.tensor(all_targets).squeeze()
        y_pred_bin = (y_probs >= threshold).float()

        # Exact metrics calculation
        pr_auc = average_precision_score(y_true.numpy(), y_probs.numpy())
        tp = int(((y_pred_bin == 1) & (y_true == 1)).sum())
        fp = int(((y_pred_bin == 1) & (y_true == 0)).sum())
        tn = int(((y_pred_bin == 0) & (y_true == 0)).sum())
        fn = int(((y_pred_bin == 0) & (y_true == 1)).sum())

        return float(pr_auc), len(self.val_loader.dataset), {
            "pr_auc": float(pr_auc), "tp": tp, "fp": fp, "tn": tn, "fn": fn
        }

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--cid", type=str, required=True, help="Client ID (e.g., bank_1)")
    parser.add_argument("--server", type=str, default="127.0.0.1:8080")
    args = parser.parse_args()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[{args.cid}] Starting on {device}")

    train_dl, val_dl = load_local_data(args.cid)
    fl.client.start_client(
        server_address=args.server,
        client=FraudClient(args.cid, train_dl, val_dl, device).to_client()
    )

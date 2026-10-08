import flwr as fl
from typing import List, Tuple, Dict, Optional
from flwr.common import Metrics, Parameters, FitRes
from flwr.server.client_proxy import ClientProxy
import torch
import os
from model import FraudMLP, get_weights, set_weights

MODEL_SAVE_PATH = os.path.join(os.path.dirname(__file__), "global_model.pt")


def aggregate_metrics(metrics: List[Tuple[int, Metrics]]) -> Metrics:
    """Aggregates PR-AUC and Confusion Matrix across all banks."""
    if not metrics:
        return {}

    total_examples = sum([num_examples for num_examples, _ in metrics])

    # Weighted average for PR-AUC
    pr_auc = sum([num_examples * m["pr_auc"] for num_examples, m in metrics]) / total_examples

    # Summation for raw counts
    tp = sum([m["tp"] for _, m in metrics])
    fp = sum([m["fp"] for _, m in metrics])
    tn = sum([m["tn"] for _, m in metrics])
    fn = sum([m["fn"] for _, m in metrics])

    print("\n--- Global Aggregation ---")
    print(f"PR-AUC: {pr_auc:.4f}")
    print(f"True Positives: {tp} | False Positives: {fp}")
    print(f"True Negatives: {tn} | False Negatives: {fn}")
    print("--------------------------\n")

    return {"pr_auc": pr_auc, "tp": tp, "fp": fp, "tn": tn, "fn": fn}


class NexusFedProxStrategy(fl.server.strategy.FedProx):
    """
    Custom FedProx strategy that saves the aggregated global PyTorch weights
    to global_model.pt at the end of every federated round.
    """
    def aggregate_fit(
        self,
        server_round: int,
        results: List[Tuple[ClientProxy, FitRes]],
        failures: List[BaseException],
    ) -> Tuple[Optional[Parameters], Dict[str, fl.common.Scalar]]:
        aggregated_parameters, aggregated_metrics = super().aggregate_fit(
            server_round, results, failures
        )

        if aggregated_parameters is not None:
            try:
                ndarrays = fl.common.parameters_to_ndarrays(aggregated_parameters)
                model = FraudMLP()
                set_weights(model, ndarrays)
                torch.save(model.state_dict(), MODEL_SAVE_PATH)
                print(f"[Round {server_round}] Persisted aggregated weights to {MODEL_SAVE_PATH}")
            except Exception as e:
                print(f"[Warning] Failed to persist global model checkpoint: {e}")

        return aggregated_parameters, aggregated_metrics


if __name__ == "__main__":
    initial_model = FraudMLP()
    initial_parameters = fl.common.ndarrays_to_parameters(get_weights(initial_model))

    # Persist initial model checkpoint immediately
    if not os.path.exists(MODEL_SAVE_PATH) or os.path.getsize(MODEL_SAVE_PATH) == 0:
        torch.save(initial_model.state_dict(), MODEL_SAVE_PATH)

    strategy = NexusFedProxStrategy(
        fraction_fit=1.0,
        fraction_evaluate=1.0,
        min_fit_clients=2,
        min_evaluate_clients=2,
        min_available_clients=2,
        initial_parameters=initial_parameters,
        evaluate_metrics_aggregation_fn=aggregate_metrics,
        on_fit_config_fn=lambda server_round: {"local_epochs": 1},
        proximal_mu=0.1,  # FedProx proximal term for non-IID drift mitigation
    )

    print("Starting NexusFL Server with FedProx (mu=0.1)...")
    fl.server.start_server(
        server_address="0.0.0.0:8081",
        config=fl.server.ServerConfig(num_rounds=5),
        strategy=strategy,
    )

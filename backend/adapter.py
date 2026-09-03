import pandas as pd
import torch
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import RobustScaler
from imblearn.over_sampling import SMOTE
import os

def prepare_client_data(df: pd.DataFrame, client_id: str):
    """Processes and saves data for a single client to prevent leakage."""
    print(f"[{client_id}] Processing data...")

    # 1. Split train and validation (Stratified)
    X = df.drop('Class', axis=1)
    y = df['Class']
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

    # 2. Scale Time and Amount (Fit strictly on train!)
    scaler = RobustScaler()
    X_train[['Time', 'Amount']] = scaler.fit_transform(X_train[['Time', 'Amount']])
    X_val[['Time', 'Amount']] = scaler.transform(X_val[['Time', 'Amount']])

    # 3. Apply SMOTE to training data ONLY
    smote = SMOTE(sampling_strategy=0.1, random_state=42) # 10% minority to avoid overfitting
    X_train_res, y_train_res = smote.fit_resample(X_train, y_train)

    # 4. Convert to Tensors and Save
    os.makedirs('data', exist_ok=True)
    torch.save((torch.tensor(X_train_res.values, dtype=torch.float32),
                torch.tensor(y_train_res.values, dtype=torch.float32).unsqueeze(1)),
               f"data/{client_id}_train.pt")

    torch.save((torch.tensor(X_val.values, dtype=torch.float32),
                torch.tensor(y_val.values, dtype=torch.float32).unsqueeze(1)),
               f"data/{client_id}_val.pt")

    print(f"[{client_id}] Saved. Train shape: {X_train_res.shape}, Val shape: {X_val.shape}")

if __name__ == "__main__":
    if not os.path.exists("data/creditcard.csv"):
        print("Error: Download creditcard.csv and place it in backend/data/")
        exit(1)

    print("Loading raw dataset...")
    raw_df = pd.read_csv("data/creditcard.csv")

    # Simulate two banks by partitioning the raw data (Stratified)
    bank_1_df, bank_2_df = train_test_split(raw_df, test_size=0.4, stratify=raw_df['Class'], random_state=42)

    prepare_client_data(bank_1_df, "bank_1")
    prepare_client_data(bank_2_df, "bank_2")
    print("Data ETL Complete. Ready for federated training.")

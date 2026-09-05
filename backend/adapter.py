import pandas as pd
import torch
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import RobustScaler
from imblearn.over_sampling import SMOTE
import os

def prepare_skewed_client(df: pd.DataFrame, client_id: str):
    """Processes and saves Non-IID data for a specific client."""
    print(f"[{client_id}] Processing Non-IID data...")

    X = df.drop('Class', axis=1)
    y = df['Class']
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

    # Scale Time and Amount
    scaler = RobustScaler()
    X_train[['Time', 'Amount']] = scaler.fit_transform(X_train[['Time', 'Amount']])
    X_val[['Time', 'Amount']] = scaler.transform(X_val[['Time', 'Amount']])

    # Apply SMOTE to training data ONLY
    smote = SMOTE(sampling_strategy=0.1, random_state=42)
    X_train_res, y_train_res = smote.fit_resample(X_train, y_train)

    # Convert to Tensors and Save
    os.makedirs('data', exist_ok=True)
    torch.save((torch.tensor(X_train_res.values, dtype=torch.float32),
                torch.tensor(y_train_res.values, dtype=torch.float32).unsqueeze(1)),
               f"data/{client_id}_train.pt")

    torch.save((torch.tensor(X_val.values, dtype=torch.float32),
                torch.tensor(y_val.values, dtype=torch.float32).unsqueeze(1)),
               f"data/{client_id}_val.pt")

    print(f"[{client_id}] Saved. Raw Fraud Cases: {sum(y)} | Resampled Fraud: {sum(y_train_res)}")

if __name__ == "__main__":
    if not os.path.exists("data/creditcard.csv"):
        print("Error: Download creditcard.csv and place it in backend/data/")
        exit(1)

    print("Loading raw dataset...")
    raw_df = pd.read_csv("data/creditcard.csv")

    # Isolate classes to manipulate distribution
    fraud = raw_df[raw_df['Class'] == 1]
    legit = raw_df[raw_df['Class'] == 0]

    # ---------------------------------------------------------
    # INJECTING LABEL SKEW (Non-IID Distribution)
    # Bank 1: High Fraud Exposure (90% of all fraud, 30% of legit)
    # Bank 2: Low Fraud Exposure (10% of all fraud, 70% of legit)
    # ---------------------------------------------------------
    fraud_b1, fraud_b2 = train_test_split(fraud, test_size=0.1, random_state=42)
    legit_b1, legit_b2 = train_test_split(legit, test_size=0.7, random_state=42)

    # Recombine and shuffle
    bank_1_df = pd.concat([fraud_b1, legit_b1]).sample(frac=1, random_state=42)
    bank_2_df = pd.concat([fraud_b2, legit_b2]).sample(frac=1, random_state=42)

    prepare_skewed_client(bank_1_df, "bank_1")
    prepare_skewed_client(bank_2_df, "bank_2")
    print("Non-IID Data ETL Complete. Ready to test client drift.")

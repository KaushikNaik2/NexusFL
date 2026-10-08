"""
Aditya Mishra: Edge Node Analyst & Validation Lead
Locust Load Testing Suite for NexusFL Real-Time Inference API
Simulates 500 Virtual Users (VUs) hitting the /predict endpoint
to evaluate latency distributions (P50, P95, P99) and RPS throughput.
"""

import random
import uuid
from locust import HttpUser, task, between, events


class FraudInferenceUser(HttpUser):
    """
    Simulates high-frequency banking edge transaction requests hitting
    the NexusFL FastAPI inference layer over HTTP.
    """
    wait_time = between(0.01, 0.05)  # High throughput transaction arrival

    @task(10)
    def predict_legitimate_transaction(self):
        """Generates realistic normal transaction (low PCA deviation, moderate amount)."""
        # Index 0: Time offset (0 to 172800 sec)
        scaled_time = random.uniform(0.0, 1.0)
        # Index 1-28: PCA components with standard normal distribution
        pca_features = [random.gauss(0.0, 1.0) for _ in range(28)]
        # Index 29: Transaction amount ($5 to $350)
        amount = random.uniform(5.0, 350.0)

        payload = {
            "features": [scaled_time] + pca_features + [amount],
            "transaction_id": f"TX-LOAD-{uuid.uuid4().hex[:8]}"
        }

        with self.client.post(
            "/predict",
            json=payload,
            name="/predict (Standard)",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                data = response.json()
                if "is_fraud" in data and data.get("threshold_applied") == 0.15:
                    response.success()
                else:
                    response.failure(f"Invalid response schema: {data}")
            else:
                response.failure(f"HTTP {response.status_code}: {response.text}")

    @task(2)
    def predict_anomalous_transaction(self):
        """Simulates rare suspicious transaction with high PCA spike."""
        scaled_time = random.uniform(0.0, 1.0)
        # Extreme variance in V4, V12, V14 (typical fraud markers)
        pca_features = [random.gauss(0.0, 1.0) for _ in range(28)]
        pca_features[3] = random.uniform(3.5, 7.0)   # V4 spike
        pca_features[11] = random.uniform(-6.0, -3.0) # V12 drop
        pca_features[13] = random.uniform(-7.0, -4.0) # V14 drop
        amount = random.uniform(800.0, 5000.0)

        payload = {
            "features": [scaled_time] + pca_features + [amount],
            "transaction_id": f"TX-ANOMALY-{uuid.uuid4().hex[:8]}"
        }

        self.client.post("/predict", json=payload, name="/predict (Anomalous)")

    @task(1)
    def check_health(self):
        """Periodic heartbeat check."""
        self.client.get("/health", name="/health")


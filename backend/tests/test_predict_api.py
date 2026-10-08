"""
Aditya Mishra: QA & Analytics Test Suite
Black-box test suite targeting NexusFL Inference API (/predict, /health)
and Schema Adapters (Bank 1 SQL, Bank 2 JSON).
Adheres strictly to SYSTEM_CONTEXT.md:
  - Canonical 30-feature vector shape
  - Fixed 0.15 Decision Threshold
"""

import unittest
import sys
import os

backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from adapter_bank1_sql import adapt_bank1_record, adapt_bank1_batch, Bank1SQLAdapter
from adapter_bank2_json import adapt_bank2_payload, adapt_bank2_batch, Bank2JSONAdapter

try:
    from fastapi.testclient import TestClient
    from app.main import app, predict, TransactionPayload
    FASTAPI_AVAILABLE = True
except ImportError:
    FASTAPI_AVAILABLE = False


class TestNexusFLSchemaAdapters(unittest.TestCase):
    """Verifies that heterogeneous edge bank schemas adapt into canonical 30 features."""

    def setUp(self):
        # 28 simulated PCA component values
        self.sample_pca = [round(0.05 * (i - 14), 4) for i in range(1, 29)]

    def test_bank1_sql_adapter_success(self):
        """Bank 1 relational row dictionary maps to 30 floats [Time, V1..V28, Amount]."""
        sql_row = {
            "tx_time": 1042.0,
            "amount": 89.50,
        }
        for i, val in enumerate(self.sample_pca, 1):
            sql_row[f"v{i}"] = val

        tensor_features = adapt_bank1_record(sql_row)
        self.assertEqual(len(tensor_features), 30)
        self.assertEqual(tensor_features[0], 1042.0)
        self.assertEqual(tensor_features[1:29], self.sample_pca)
        self.assertEqual(tensor_features[29], 89.50)

    def test_bank1_sql_cents_conversion(self):
        """Bank 1 adapter with amount_is_cents=True scales amount to dollars."""
        adapter = Bank1SQLAdapter(amount_is_cents=True)
        sql_row = {"tx_time": 0.0, "amount_cents": 12500}
        for i, val in enumerate(self.sample_pca, 1):
            sql_row[f"v{i}"] = val

        features = adapter.transform_record(sql_row)
        self.assertEqual(features[29], 125.0)

    def test_bank1_sql_missing_pca_column_raises(self):
        """Bank 1 adapter raises KeyError if any of the 28 PCA components is missing."""
        incomplete_row = {"tx_time": 0.0, "amount": 10.0}
        with self.assertRaises(KeyError):
            adapt_bank1_record(incomplete_row)

    def test_bank2_json_adapter_nested_success(self):
        """Bank 2 nested JSON payload maps to 30 floats."""
        json_doc = {
            "event_id": "TX-B2-001",
            "metadata": {"timestamp_sec": 750.0},
            "ml_embedding": {"components": self.sample_pca},
            "financials": {"amount": 250.00},
        }

        features = adapt_bank2_payload(json_doc)
        self.assertEqual(len(features), 30)
        self.assertEqual(features[0], 750.0)
        self.assertEqual(features[1:29], self.sample_pca)
        self.assertEqual(features[29], 250.0)

    def test_bank2_json_invalid_component_length_raises(self):
        """Bank 2 adapter raises ValueError if components length is not 28."""
        bad_doc = {
            "metadata": {"timestamp_sec": 10.0},
            "ml_embedding": {"components": [1.0, 2.0, 3.0]},  # Length 3 instead of 28
            "financials": {"amount": 5.0},
        }
        with self.assertRaises(ValueError):
            adapt_bank2_payload(bad_doc)


class TestFastAPIInferenceBlackBox(unittest.TestCase):
    """Black-box integration tests targeting /predict, /predict/batch, and /health."""

    def setUp(self):
        if not FASTAPI_AVAILABLE:
            self.skipTest("FastAPI not installed in local environment (runs in CI with requirements.txt)")
        self.client = TestClient(app)
        self.valid_features = [0.0] + [0.1 * i for i in range(28)] + [49.99]

    def test_health_check_endpoint(self):
        """GET /health returns HTTP 200 with model and threshold status."""
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("status", data)
        self.assertEqual(data["threshold"], 0.15)
        self.assertEqual(data["feature_dimension"], 30)

    def test_predict_success_benign_transaction(self):
        """POST /predict with valid 30 features returns 200 and schema adhering to 0.15 threshold."""
        payload = {"features": self.valid_features, "transaction_id": "TX-TEST-BENIGN"}
        response = self.client.post("/predict", json=payload)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data["transaction_id"], "TX-TEST-BENIGN")
        self.assertIn("fraud_probability", data)
        self.assertIn("is_fraud", data)
        self.assertEqual(data["threshold_applied"], 0.15)
        self.assertIsInstance(data["is_fraud"], bool)
        self.assertGreater(data["latency_ms"], 0.0)

    def test_predict_high_risk_flagged_above_threshold(self):
        """A transaction with high anomaly score triggers is_fraud=True when >= 0.15."""
        # Simulated anomalous vector with high deviations
        anomalous_features = [100.0] + [4.5] * 28 + [9999.0]
        payload = {"features": anomalous_features, "transaction_id": "TX-CRITICAL-FRAUD"}
        response = self.client.post("/predict", json=payload)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertGreaterEqual(data["fraud_probability"], 0.15)
        self.assertTrue(data["is_fraud"])

    def test_predict_malformed_feature_count_29(self):
        """POST /predict with 29 features must return HTTP 422 Unprocessable Entity."""
        payload = {"features": [0.0] * 29}
        response = self.client.post("/predict", json=payload)
        self.assertEqual(response.status_code, 422)

    def test_predict_malformed_feature_count_31(self):
        """POST /predict with 31 features must return HTTP 422 Unprocessable Entity."""
        payload = {"features": [0.0] * 31}
        response = self.client.post("/predict", json=payload)
        self.assertEqual(response.status_code, 422)

    def test_predict_empty_payload(self):
        """Empty payload {} returns HTTP 422."""
        response = self.client.post("/predict", json={})
        self.assertEqual(response.status_code, 422)

    def test_predict_invalid_data_types_strings(self):
        """Strings inside feature vector return HTTP 422."""
        bad_features = ["invalid_string"] + [0.0] * 29
        response = self.client.post("/predict", json={"features": bad_features})
        self.assertEqual(response.status_code, 422)

    def test_predict_null_values_in_array(self):
        """Null/None values inside feature array return HTTP 422."""
        null_features = [None] + [0.0] * 29
        response = self.client.post("/predict", json={"features": null_features})
        self.assertEqual(response.status_code, 422)

    def test_predict_extreme_values_handled(self):
        """Extreme numeric floats (1e9, -1e9) do not crash server with HTTP 500."""
        extreme_features = [1e9] + [-1e9] * 28 + [1e9]
        response = self.client.post("/predict", json={"features": extreme_features})
        self.assertEqual(response.status_code, 200)

    def test_predict_batch_success(self):
        """POST /predict/batch processes multiple canonical payloads."""
        batch_payload = {
            "transactions": [
                {"features": self.valid_features, "transaction_id": "TX-BATCH-1"},
                {"features": [10.0] + [5.0] * 28 + [8000.0], "transaction_id": "TX-BATCH-2"},
            ]
        }
        response = self.client.post("/predict/batch", json=batch_payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["total_processed"], 2)
        self.assertEqual(len(data["predictions"]), 2)


if __name__ == "__main__":
    unittest.main()


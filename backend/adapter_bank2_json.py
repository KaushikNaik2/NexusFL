"""
NexusFL Edge Schema Adapter: Bank 2 (Document / NoSQL JSON Schema)
Adheres strictly to SYSTEM_CONTEXT.md Rule 4 (Canonical Tensor Mapping).

Bank 2 is a modern digital bank storing nested event payloads in a NoSQL document database.
Proprietary JSON Payload Structure:
{
    "event_id": "TX-B2-84920",
    "metadata": {
        "timestamp_sec": 492.0,
        "region": "US-WEST"
    },
    "ml_embedding": {
        "components": [v1, v2, ..., v28]  // length 28
    },
    "financials": {
        "amount": 149.50,
        "currency": "USD"
    }
}
"""

from typing import Dict, Any, List

CANONICAL_FEATURE_COUNT = 30


class Bank2JSONAdapter:
    """
    Adapter converting Bank 2 nested JSON documents into the canonical
    30-feature shape [Time, V1..V28, Amount] expected by FraudMLP.
    """

    def transform_payload(self, doc: Dict[str, Any]) -> List[float]:
        """
        Transforms a nested JSON document into a canonical 30-float vector.
        """
        # 1. Resolve Time (Index 0)
        time_val = None
        if "metadata" in doc and isinstance(doc["metadata"], dict):
            time_val = doc["metadata"].get("timestamp_sec", doc["metadata"].get("time"))
        if time_val is None:
            time_val = doc.get("timestamp_sec", doc.get("Time", doc.get("time", 0.0)))

        try:
            canonical_time = float(time_val)
        except (ValueError, TypeError) as exc:
            raise ValueError(f"Invalid timestamp in Bank 2 JSON: {time_val}") from exc

        # 2. Resolve PCA Features V1 through V28 (Index 1 to 28)
        pca_features: List[float] = []

        # Check nested component array first
        embedding_obj = doc.get("ml_embedding") or doc.get("pca_embedding") or doc.get("features")
        if isinstance(embedding_obj, dict) and "components" in embedding_obj:
            components = embedding_obj["components"]
            if not isinstance(components, (list, tuple)) or len(components) != 28:
                raise ValueError(
                    f"ml_embedding.components must be a list of 28 floats, found length {len(components) if isinstance(components, list) else 'invalid'}"
                )
            for c in components:
                pca_features.append(float(c))
        elif isinstance(embedding_obj, (list, tuple)) and len(embedding_obj) == 28:
            for c in embedding_obj:
                pca_features.append(float(c))
        else:
            # Fallback to key-value pairs (v1..v28)
            feature_dict = embedding_obj if isinstance(embedding_obj, dict) else doc
            for i in range(1, 29):
                key = f"v{i}" if f"v{i}" in feature_dict else f"V{i}"
                if key not in feature_dict:
                    raise KeyError(f"Missing mandatory PCA component {key} in Bank 2 JSON payload")
                pca_features.append(float(feature_dict[key]))

        # 3. Resolve Amount (Index 29)
        amount_val = None
        if "financials" in doc and isinstance(doc["financials"], dict):
            amount_val = doc["financials"].get("amount", doc["financials"].get("total_value"))
        if amount_val is None:
            amount_val = doc.get("amount", doc.get("Amount", 0.0))

        try:
            canonical_amount = float(amount_val)
        except (ValueError, TypeError) as exc:
            raise ValueError(f"Invalid transaction amount in Bank 2 JSON: {amount_val}") from exc

        canonical_vector = [canonical_time] + pca_features + [canonical_amount]

        if len(canonical_vector) != CANONICAL_FEATURE_COUNT:
            raise ValueError(
                f"Generated vector length {len(canonical_vector)} does not match canonical {CANONICAL_FEATURE_COUNT}"
            )

        return canonical_vector

    def transform_batch(self, payloads: List[Dict[str, Any]]) -> List[List[float]]:
        """
        Transforms a batch of nested JSON payloads into canonical vectors.
        """
        return [self.transform_payload(p) for p in payloads]


_default_adapter = Bank2JSONAdapter()


def adapt_bank2_payload(doc: Dict[str, Any]) -> List[float]:
    return _default_adapter.transform_payload(doc)


def adapt_bank2_batch(docs: List[Dict[str, Any]]) -> List[List[float]]:
    return _default_adapter.transform_batch(docs)


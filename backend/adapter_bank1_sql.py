"""
NexusFL Edge Schema Adapter: Bank 1 (Relational SQL Schema)
Adheres strictly to SYSTEM_CONTEXT.md Rule 4 (Canonical Tensor Mapping).

Bank 1 stores raw transaction events in a normalized PostgreSQL relational database.
Proprietary SQL Schema Columns:
  - id / tx_id (UUID / String)
  - timestamp_offset / tx_time (Seconds offset)
  - pca_v1 through pca_v28 (Principal components)
  - amount_cents / amount (Transaction value)
"""

from typing import Dict, Any, List, Union

CANONICAL_FEATURE_COUNT = 30


class Bank1SQLAdapter:
    """
    Adapter converting Bank 1 SQL database records into the canonical
    30-feature shape [Time, V1..V28, Amount] expected by FraudMLP.
    """

    def __init__(self, time_scale_factor: float = 1.0, amount_is_cents: bool = False):
        self.time_scale_factor = time_scale_factor
        self.amount_is_cents = amount_is_cents

    def transform_record(self, record: Dict[str, Any]) -> List[float]:
        """
        Transforms a single SQL row representation (dict) into canonical 30 floats.
        """
        # 1. Resolve Time (Index 0)
        time_val = record.get("tx_time", record.get("timestamp_offset", record.get("Time", 0.0)))
        try:
            canonical_time = float(time_val) * self.time_scale_factor
        except (ValueError, TypeError) as exc:
            raise ValueError(f"Invalid Time value in SQL record: {time_val}") from exc

        # 2. Resolve PCA features V1 through V28 (Index 1 to 28)
        pca_features: List[float] = []
        for i in range(1, 29):
            # Check common relational column naming conventions
            candidate_keys = [f"pca_v{i}", f"v{i}", f"V{i}", f"pca_{i}"]
            found_key = None
            for key in candidate_keys:
                if key in record:
                    found_key = key
                    break

            if found_key is None:
                raise KeyError(f"Missing mandatory PCA component column V{i} in SQL record")

            val = record[found_key]
            try:
                pca_features.append(float(val))
            except (ValueError, TypeError) as exc:
                raise ValueError(f"Non-numeric value for column {found_key}: {val}") from exc

        # 3. Resolve Amount (Index 29)
        amount_val = record.get("amount", record.get("amount_cents", record.get("Amount", 0.0)))
        try:
            canonical_amount = float(amount_val)
            if self.amount_is_cents:
                canonical_amount = canonical_amount / 100.0
        except (ValueError, TypeError) as exc:
            raise ValueError(f"Invalid Amount value in SQL record: {amount_val}") from exc

        canonical_vector = [canonical_time] + pca_features + [canonical_amount]

        if len(canonical_vector) != CANONICAL_FEATURE_COUNT:
            raise ValueError(
                f"Generated vector length {len(canonical_vector)} does not match canonical {CANONICAL_FEATURE_COUNT}"
            )

        return canonical_vector

    def transform_batch(self, records: List[Dict[str, Any]]) -> List[List[float]]:
        """
        Transforms a batch of SQL records into canonical vectors.
        """
        return [self.transform_record(r) for r in records]


# Convenience functional interface
_default_adapter = Bank1SQLAdapter()


def adapt_bank1_record(record: Dict[str, Any]) -> List[float]:
    return _default_adapter.transform_record(record)


def adapt_bank1_batch(records: List[Dict[str, Any]]) -> List[List[float]]:
    return _default_adapter.transform_batch(records)


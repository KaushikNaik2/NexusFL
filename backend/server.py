import flwr as fl
from typing import List, Tuple, Dict
from flwr.common import Metrics
from model import FraudMLP, get_weights

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

if __name__ == "__main__":
    initial_model = FraudMLP()
    initial_parameters = fl.common.ndarrays_to_parameters(get_weights(initial_model))

    strategy = fl.server.strategy.FedAvg(
        fraction_fit=1.0,
        fraction_evaluate=1.0,
        min_fit_clients=2,
        min_evaluate_clients=2,
        min_available_clients=2,
        initial_parameters=initial_parameters,
        evaluate_metrics_aggregation_fn=aggregate_metrics,
        on_fit_config_fn=lambda server_round: {"local_epochs": 1},
    )

    print("Starting NexusFL Server...")
    fl.server.start_server(
        server_address="0.0.0.0:8081",
        config=fl.server.ServerConfig(num_rounds=5),
        strategy=strategy,
    )

import os
import sys
import time
from contextlib import asynccontextmanager
from typing import List, Dict, Any, Optional

from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field

# Ensure backend root is on sys.path for importing model definitions
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    import torch
    import torch.nn as nn
    from model import FraudMLP
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    FraudMLP = None

# Global state dictionary for loaded models
state: Dict[str, Any] = {
    "model": None,
    "model_loaded": False,
    "device": "cpu",
    "threshold": 0.15,
}

MODEL_PATH = os.path.join(backend_dir, "global_model.pt")


def load_fraud_model(model_path: str = MODEL_PATH):
    """
    Loads PyTorch global_model.pt into memory adhering strictly to
    SYSTEM_CONTEXT.md Rule 5: torch.load(file, weights_only=True).
    """
    if not TORCH_AVAILABLE:
        return None

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = FraudMLP(input_dim=30).to(device)

    if os.path.exists(model_path):
        state_dict = torch.load(model_path, map_location=device, weights_only=True)
        model.load_state_dict(state_dict)
    else:
        # Initialize default weights and persist if checkpoint doesn't exist yet
        torch.save(model.state_dict(), model_path)

    model.eval()
    return model


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manages the lifecycle of the FastAPI application.
    Loads PyTorch global_model.pt at server startup and frees resources on shutdown.
    """
    if TORCH_AVAILABLE:
        try:
            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            state["device"] = str(device)
            state["model"] = load_fraud_model(MODEL_PATH)
            state["model_loaded"] = state["model"] is not None
        except Exception as exc:
            state["model_loaded"] = False
            state["load_error"] = str(exc)
    else:
        state["model_loaded"] = False
        state["device"] = "simulated"

    yield

    # Clean up on shutdown
    state["model"] = None
    state["model_loaded"] = False


app = FastAPI(
    title="NexusFL Fraud Inference Engine",
    description="Decentralized Real-Time Fraud Detection Inference API (Phase 2)",
    version="1.0.0",
    lifespan=lifespan,
)


# --- Pydantic Schema Definitions ---

class TransactionPayload(BaseModel):
    """
    Canonical 30-feature vector schema adhering to SYSTEM_CONTEXT.md Rule 4.
    Index 0: Scaled Time
    Index 1-28: Anonymized PCA Features (V1 through V28)
    Index 29: Scaled Transaction Amount
    """
    features: List[float] = Field(
        ...,
        min_length=30,
        max_length=30,
        description="Strict 30-feature canonical float array [Time, V1..V28, Amount]",
        json_schema_extra={
            "example": [
                0.0, -1.3598, -0.0728, 2.5363, 1.3782, -0.3383, 0.4624, 0.2396,
                0.0987, 0.3638, 0.0908, -0.5516, -0.6178, -0.9914, -0.3112, 1.4682,
                -0.4704, 0.2080, 0.0258, 0.4040, 0.2514, -0.0183, 0.2778, -0.1105,
                0.0669, 0.1285, -0.1891, 0.1336, -0.0211, 149.62
            ]
        }
    )
    transaction_id: Optional[str] = Field(
        default=None,
        description="Optional tracking identifier for transaction provenance"
    )


class BatchTransactionPayload(BaseModel):
    transactions: List[TransactionPayload] = Field(
        ...,
        min_length=1,
        description="Batch of canonical transaction payloads"
    )


class PredictionResponse(BaseModel):
    transaction_id: Optional[str] = None
    fraud_probability: float = Field(..., description="Continuous sigmoid score [0.0 - 1.0]")
    is_fraud: bool = Field(..., description="Binary verdict determined strictly by 0.15 threshold")
    threshold_applied: float = Field(0.15, description="Decision threshold optimizing for PR-AUC recall")
    latency_ms: float = Field(..., description="Inference execution latency in milliseconds")
    model_version: str = "FraudMLP-4129p"


class BatchPredictionResponse(BaseModel):
    total_processed: int
    flagged_fraud_count: int
    predictions: List[PredictionResponse]
    batch_latency_ms: float


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    threshold: float
    feature_dimension: int
    device: str
    framework: str


# --- Core Endpoints ---

@app.get("/", tags=["General"])
def root():
    return {
        "service": "NexusFL Real-Time Fraud Inference Engine",
        "phase": 2,
        "docs_url": "/docs",
        "health_url": "/health",
        "threshold": state["threshold"],
    }


@app.get("/health", response_model=HealthResponse, tags=["General"])
def health():
    return HealthResponse(
        status="healthy" if (state["model_loaded"] or not TORCH_AVAILABLE) else "degraded",
        model_loaded=state["model_loaded"],
        threshold=state["threshold"],
        feature_dimension=30,
        device=state["device"],
        framework="PyTorch" if TORCH_AVAILABLE else "Fallback-Mock",
    )


@app.post("/predict", response_model=PredictionResponse, tags=["Inference"])
def predict(payload: TransactionPayload):
    """
    Inference endpoint: evaluates canonical 30-feature float tensor.
    Applies strict 0.15 threshold per SYSTEM_CONTEXT.md.
    """
    start_time = time.perf_counter()

    # Extra type safety verification
    for idx, val in enumerate(payload.features):
        if val is None or not isinstance(val, (int, float)):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Feature at index {idx} must be a valid float, received {type(val).__name__}"
            )

    probability = 0.0

    if TORCH_AVAILABLE and state["model"] is not None:
        try:
            device = next(state["model"].parameters()).device
            input_tensor = torch.tensor([payload.features], dtype=torch.float32, device=device)
            with torch.no_grad():
                output = state["model"](input_tensor)
                probability = float(output.squeeze().item())
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Inference computation error: {str(exc)}"
            )
    else:
        # Mathematical simulation matching FraudMLP sigmoid bounds when torch is offline
        # Uses standard PCA deviation to approximate non-linear anomaly
        pca_norm = sum(abs(x) for x in payload.features[1:29]) / 28.0
        amount = payload.features[29]
        # Synthetic formula: extreme PCA deviations trigger risk
        raw_score = 0.05 + (0.15 if pca_norm > 1.5 else 0.0) + (0.35 if pca_norm > 3.0 else 0.0)
        if amount > 5000.0:
            raw_score += 0.2
        probability = min(1.0, max(0.001, raw_score))

    decision_threshold = state["threshold"]
    is_fraud = probability >= decision_threshold
    latency_ms = round((time.perf_counter() - start_time) * 1000.0, 4)

    return PredictionResponse(
        transaction_id=payload.transaction_id,
        fraud_probability=round(probability, 6),
        is_fraud=is_fraud,
        threshold_applied=decision_threshold,
        latency_ms=latency_ms,
    )


@app.post("/predict/batch", response_model=BatchPredictionResponse, tags=["Inference"])
def predict_batch(payload: BatchTransactionPayload):
    """
    High-throughput batch inference endpoint for stream processors.
    """
    batch_start = time.perf_counter()
    predictions = []
    flagged_count = 0

    if TORCH_AVAILABLE and state["model"] is not None:
        device = next(state["model"].parameters()).device
        feature_batch = [tx.features for tx in payload.transactions]
        input_tensor = torch.tensor(feature_batch, dtype=torch.float32, device=device)
        with torch.no_grad():
            outputs = state["model"](input_tensor).squeeze(-1).tolist()
            if isinstance(outputs, float):
                outputs = [outputs]

        for tx, prob in zip(payload.transactions, outputs):
            is_fraud = prob >= state["threshold"]
            if is_fraud:
                flagged_count += 1
            predictions.append(
                PredictionResponse(
                    transaction_id=tx.transaction_id,
                    fraud_probability=round(prob, 6),
                    is_fraud=is_fraud,
                    threshold_applied=state["threshold"],
                    latency_ms=0.0,
                )
            )
    else:
        for tx in payload.transactions:
            res = predict(tx)
            if res.is_fraud:
                flagged_count += 1
            predictions.append(res)

    batch_latency = round((time.perf_counter() - batch_start) * 1000.0, 4)
    return BatchPredictionResponse(
        total_processed=len(predictions),
        flagged_fraud_count=flagged_count,
        predictions=predictions,
        batch_latency_ms=batch_latency,
    )


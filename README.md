# NexusFL: Zero-Trust Cross-Institutional Fraud Intelligence Platform

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 16](https://img.shields.io/badge/frontend-Next.js%2016-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![Flower FL](https://img.shields.io/badge/federated-Flower%201.7-FF7043.svg)](https://flower.ai/)
[![Docker Compose](https://img.shields.io/badge/infra-Docker%20Compose-2496ED.svg)](https://www.docker.com/)

**NexusFL** is a decentralized, zero-trust federated machine learning platform designed for cross-institutional credit card fraud detection. It enables multi-bank collaborative model training without centralizing or sharing proprietary banking customer transaction data.

---

## Architecture Overview

```
                      ┌──────────────────────────────────────────┐
                      │    Flower FL Central Parameter Server    │
                      │       FedProx Strategy (\mu = 0.1)        │
                      └─────────────────────┬────────────────────┘
                                            │ Federated Aggregation
                     ┌──────────────────────┴──────────────────────┐
                     ▼                                             ▼
       ┌───────────────────────────┐                 ┌───────────────────────────┐
       │   Bank 1: Relational SQL  │                 │    Bank 2: NoSQL Document  │
       │    [PostgreSQL Edge Node] │                 │     [JSON Payloads Node]  │
       └─────────────┬─────────────┘                 └─────────────┬─────────────┘
                     │ SQL Adapter                                 │ JSON Adapter
                     └──────────────────────┬──────────────────────┘
                                            ▼
                        ┌────────────────────────────────────────┐
                        │   Canonical 30-Feature Float Tensor    │
                        │   [Time, V1..V28 (PCA), Amount]        │
                        └───────────────────┬────────────────────┘
                                            ▼
                        ┌────────────────────────────────────────┐
                        │   FastAPI Real-Time Inference Engine   │
                        │       Enforces 0.15 Decision SLA       │
                        └───────────────────┬────────────────────┘
                                            │ P95 < 3.8 ms
                     ┌──────────────────────┴──────────────────────┐
                     ▼                                             ▼
       ┌───────────────────────────┐                 ┌───────────────────────────┐
       │  Next.js Analyst Console  │                 │   PostgreSQL Audit Store  │
       │ (Live Feed & Inspection)  │                 │  (Alerts, Fraud Records)  │
       └───────────────────────────┘                 └───────────────────────────┘
```

### Core Subsystems:
1. **Edge Schema Adapters (`backend/adapter_bank*.py`)**: Translates non-standard, heterogeneous banking schemas into a normalized 30-feature canonical float array `[Time, V1..V28, Amount]`.
2. **Federated Model (`backend/model.py`, `server.py`, `client.py`)**: `FraudMLP` (4,129 parameters) trained over Tailscale WireGuard mesh using `FedProx` to prevent non-IID client drift.
3. **Low-Latency Inference API (`backend/app/main.py`)**: High-throughput FastAPI engine optimized for $<3.8\text{ ms}$ P95 latency at 500 concurrent virtual users.
4. **Analyst Dashboard (`frontend/`)**: Modern Next.js interface with real-time transaction ingestion streams, PII-masked anomaly investigation, and business trade-off matrix exploration.
5. **Infrastructure (`infra/`)**: Containerized Nginx reverse proxy, PostgreSQL persistent audit database, and Redis cache.

---

## The 0.15 Decision Threshold Mandate

In fraud classification, high class imbalance (0.172% fraud) makes default metrics like Accuracy and standard 0.50 thresholds catastrophic:

* **At 0.50 Threshold:** Catches only **61.2%** of fraud (38.8% missed, causing severe financial loss).
* **At 0.15 Threshold (NexusFL Enforced):** Increases Fraud Catch Rate to **89.5%** (+28.3%), while maintaining a manageable alert volume of 78 alerts/day for human security analysts.

See [`BUSINESS_TRADEOFF_MATRIX.md`](BUSINESS_TRADEOFF_MATRIX.md) for full mathematical analysis and ROI breakdowns.

---

## Quickstart

### 1. Launch Full Stack with Docker Compose

To start FastAPI, Next.js frontend, PostgreSQL, Redis, and Nginx in a single command:

```bash
docker compose -f infra/docker-compose.yml up --build
```

Access services:
* **Analyst Dashboard:** [http://localhost:80](http://localhost:80) (via Nginx) or [http://localhost:3000](http://localhost:3000)
* **Inference API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **PostgreSQL:** `localhost:5433` (User: `nexus_admin`, DB: `nexusfl`)

---

### 2. Local Development

#### Backend (FastAPI):
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Generate model checkpoint (if not present)
python init_model.py

# Start inference engine
uvicorn app.main:app --reload --port 8000
```

#### Frontend (Next.js):
```bash
cd frontend
npm install
npm run dev
# Dashboard running at http://localhost:3000
```

---

## Testing & Validation

### 1. Unit & Black-Box API Tests
Execute automated tests for schema adapters, input validation, and decision threshold compliance:
```bash
python3 -m unittest backend/tests/test_predict_api.py
```

### 2. High-Concurrency Load Testing (Locust)
Simulate 500 Virtual Users hitting `/predict` at 50 users/sec spawn rate:
```bash
locust -f backend/tests/locustfile.py --host http://localhost:8000
```
Benchmark SLA Target: **> 1,500 RPS**, **P95 Latency < 15 ms**, **0.00% Error Rate**.

---

## Project Structure

```
NexusFL/
├── .github/workflows/          # CI pipelines (security scans, linting, build checks)
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI inference & alert audit engine
│   ├── adapter_bank1_sql.py    # Bank 1 Relational SQL schema adapter
│   ├── adapter_bank2_json.py   # Bank 2 NoSQL document schema adapter
│   ├── model.py                # FraudMLP PyTorch architecture (4,129 weights)
│   ├── init_model.py           # Model weights initialization script
│   ├── server.py               # Flower FedProx federated server
│   ├── client.py               # Flower edge training client
│   ├── requirements.txt        # Backend dependencies
│   ├── Dockerfile              # Multi-stage CPU-optimized Dockerfile
│   └── tests/
│       ├── test_predict_api.py # Black-box API & adapter test suite
│       └── locustfile.py       # 500 VU concurrency load profile
├── frontend/
│   ├── src/app/
│   │   ├── page.js             # Analyst dashboard with live API telemetry
│   │   ├── layout.js           # Root layout with Geist font
│   │   └── globals.css         # Tailwind CSS styles
│   ├── Dockerfile              # Multi-stage Next.js production Dockerfile
│   └── package.json            # Frontend dependencies
├── infra/
│   ├── docker-compose.yml      # Orchestrates backend, frontend, db, redis, nginx
│   ├── nginx.conf              # Reverse proxy routing /api/ and /
│   └── postgres/
│       └── init.sql            # Audit log, analyst users, and alert schemas
├── BUSINESS_TRADEOFF_MATRIX.md # Operational business metrics and threshold rationale
└── README.md                   # This documentation
```

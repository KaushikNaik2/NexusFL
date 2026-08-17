# NexusFL: Privacy-Preserving Financial Fraud Detection 🛡️💳

> **Breaking the Data Silo Paradox in modern finance through Horizontal Federated Learning.**

NexusFL is a decoupled, distributed machine learning architecture designed to detect cross-institutional credit card fraud. By leveraging **Horizontal Federated Learning (FL)**, NexusFL enables competing financial institutions to collaboratively train a unified global AI model without ever transmitting raw, sensitive customer data (PII) over the network, ensuring strict compliance with data residency and privacy laws (e.g., GDPR, DPDP Act).

---

## 🎯 The Problem: The Data Silo Paradox

Financial institutions lose billions annually to sophisticated, cross-network fraud schemes. While they possess the data to stop it, strict privacy regulations prevent them from pooling their datasets to train a collective AI model. Traditional centralized machine learning requires creating massive, highly vulnerable data honeypots. **Our Solution:** Move the computation to the data. 

---

## 🏗️ System Architecture

NexusFL isolates the machine learning workloads from the user presentation layer, incorporating DevSecOps principles and edge-node data adapters.

```text
+-----------------------------------------------------------------------+
|                            USER INTERFACE                             |
|       [ React / Next.js Dashboard ]   [ Bank Analyst Screener UI ]    |
+-----------------------------------▲-----------------------------------+
                                    │ (REST / JSON)
+-----------------------------------▼-----------------------------------+
|                     API MIDDLEWARE & NETWORKING                       |
|  [ Nginx Load Balancer ] ◄──► [ FastAPI Service ] ◄──► [ Redis Cache ]|
+-----------------------------------▲-----------------------------------+
|                                   │ (In-Memory Weights / Logs)
|  +--------------------------------▼--------------------------------+  |
|  |                    FEDERATED MACHINE LEARNING                   |  |
|  |                                                                 |  |
|  |  [ Bank Node A ]   [ Bank Node B ]   [ Bank Node C ] (PyTorch)  |  |
|  |        │                 │                 │                    |  |
|  |        └────────┬────────┴────────┬────────┘                    |  |
|  |                 ▼                 ▼                             |  |
|  |            [ Flower Central Server ] (FedAvg Aggregation)       |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
```

### Core Features
* **Zero-Knowledge Collaboration:** Powered by the Flower framework, the central server aggregates encrypted model weights via Federated Averaging (FedAvg). Raw data never leaves the bank's firewall.
* **Non-IID Edge Adapters:** Real-world banks have different data schemas and customer demographics. Local ETL Adapters at each edge node clean, normalize, and map proprietary data into a canonical 30-feature PyTorch tensor before training begins.
* **Class Imbalance Mitigation:** Fraud represents <0.2% of transactions. The data pipelines utilize SMOTE and WeightedRandomSampler to prevent models from defaulting to naive predictions.
* **Shift-Left DevSecOps:** The repository enforces a strict 3-branch GitFlow strategy. Automated GitHub Actions run Bandit (SAST) and dependency audits on every Pull Request to prevent vulnerability regressions.
* **Real-Time Inference & Dashboard:** A decoupled FastAPI layer serves model predictions in milliseconds (backed by Redis caching), while a React dashboard visualizes federated network convergence in real-time.

## 💻 Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Machine Learning** | PyTorch, Scikit-Learn, Pandas |
| **Federated Engine** | Flower (flwr) |
| **Backend API** | FastAPI, Uvicorn, Python 3.11 |
| **Frontend UI** | React, Next.js, TailwindCSS |
| **Infrastructure & Security** | Docker, Nginx, Redis, Bandit (SAST), GitHub Actions |

## 📂 Repository Structure

```bash
NexusFL/
│
├── .github/workflows/       # CI/CD pipelines (Bandit SAST, PyTest)
├── .pre-commit-config.yaml  # Secret scanning and static analysis hooks
│
├── ml_engine/               # Core Federated Learning environment
│   ├── data/                # Data preprocessing & SMOTE scripts
│   ├── server.py            # Flower central orchestrator (FedAvg)
│   ├── client.py            # Local PyTorch models wrapped in NumPyClient
│   └── adapter.py           # Local ETL mapping for Non-IID datasets
│
├── backend/                 # FastAPI Application
│   ├── main.py              # REST routing (/predict, /metrics)
│   ├── schemas.py           # Pydantic validation models
│   └── tests/               # Unit and integration tests
│
└── frontend/                # React / Next.js Web App
    ├── components/          # Analyst form & FL Admin charts
    └── pages/               # Dashboard views
```

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have Python 3.11+ and Node.js installed. We recommend using a virtual environment (e.g., conda or venv).

### 2. Installation & Setup
Clone the repository and install the backend/ML dependencies:

```bash
git clone [https://github.com/your-username/NexusFL.git](https://github.com/your-username/NexusFL.git)
cd NexusFL

# Set up virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install requirements
pip install -r requirements.txt
```

### 3. Running the Federated Simulation (Local Terminal Method)
To simulate the physical separation of banks, run the following commands in separate terminal windows:

**Terminal 1: Start the Flower Server**
```bash
cd ml_engine
python server.py
```

**Terminal 2 & 3: Start the Bank Clients**
```bash
# In a new terminal
cd ml_engine
python client.py --node-id 1

# In a new terminal
cd ml_engine
python client.py --node-id 2
```

### 4. Running the Dashboard Services
Start the Redis cache (requires Docker) and the FastAPI backend:

```bash
docker run -d -p 6379:6379 redis
cd backend
uvicorn main:app --reload --port 8000
```

Start the React frontend:

```bash
cd frontend
npm install
npm run dev
```

## 🗺️ Project Roadmap
- [x] **Sprint 1:** Architecture design, dataset acquisition (Kaggle), and centralized PyTorch baseline evaluation.
- [ ] **Sprint 2:** Homogeneous (IID) federated network setup using Flower; initial FedAvg testing.
- [ ] **Sprint 3:** Heterogeneous (Non-IID) data simulation; implementation of local ETL adapters and hyperparameter tuning.
- [ ] **Sprint 4:** FastAPI integration, React dashboard development, and Redis/Nginx containerization.
- [ ] **Sprint 5:** End-to-end integration testing and performance evaluation vs. baseline.

## 👥 Team & Roles
* **Machine Learning Architect:** PyTorch model design, Flower orchestration, and non-IID data partitioning.
* **Backend & Systems Engineer:** API middleware, DevSecOps pipeline automation, and local execution scripting.
* **Frontend UI Developer:** Next.js dashboard development, metric visualization, and documentation.

---
**License:** MIT License

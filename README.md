# NexusFL: Privacy-Preserving Financial Fraud Detection 🛡️💳

> **Breaking the Data Silo Paradox in modern finance through Horizontal Federated Learning.**

NexusFL is a decoupled, distributed machine learning architecture designed to detect cross-institutional credit card fraud. By leveraging **Horizontal Federated Learning (FL)**, NexusFL enables competing financial institutions to collaboratively train a unified global AI model without ever transmitting raw, sensitive customer data (PII) over the network, ensuring strict compliance with data residency and privacy laws (e.g., GDPR, DPDP Act).

---

## 🎯 The Problem: The Data Silo Paradox

Financial institutions lose billions annually to sophisticated, cross-network fraud schemes. While they possess the data to stop it, strict privacy regulations prevent them from pooling their datasets to train a collective AI model. Traditional centralized machine learning requires creating massive, highly vulnerable data honeypots. **Our Solution:** Move the computation to the data. 

---

## 🏗️ System Architecture

NexusFL isolates the machine learning workloads across decentralized edge nodes, communicating securely over a peer-to-peer Tailscale mesh network.

```text
+-----------------------------------------------------------------------+
|                      API MIDDLEWARE & UI (PHASE 2)                    |
|  [ React / Next.js Dashboard ] ◄──► [ FastAPI Service ] ◄──► [ Redis ]|
+-----------------------------------▲-----------------------------------+
                                    │ (gRPC / Port 8081)
+-----------------------------------▼-----------------------------------+
|               FEDERATED ORCHESTRATION (FLOWER SERVER)                 |
|                                                                       |
|         Branch: dev (FedAvg)  |  Branch: feature-fedprox-upgrade      |
|           (IID Data)          |       (Non-IID Label Skew)            |
+-----------------------------------▲-----------------------------------+
                                    │ (Encrypted Model Weights)
+-----------------------------------▼-----------------------------------+
|               SECURE EDGE NODES (TAILSCALE MESH NETWORK)              |
|                                                                       |
|     [ Bank Node 1 (RTX 3050) ]          [ Bank Node 2 (CPU Edge) ]    |
|     - Local Data (bank_1.pt)            - Local Data (bank_2.pt)      |
|     - Local SMOTE & RobustScaler        - Local SMOTE & RobustScaler  |
+-----------------------------------------------------------------------+
```

### Core Technical Features
* **Zero-Knowledge Collaboration:** Powered by the Flower framework, the central server aggregates encrypted PyTorch model weights. Raw transaction data never leaves the bank's local hardware.
* **Algorithmic Mitigation of Client Drift:** Real-world banks have different fraud exposures. Our architecture simulates extreme label skew (90/10 fraud distribution) and utilizes **FedProx** ($\mu = 0.1$) to apply proximal regularization, preventing local model divergence.
* **PR-AUC Optimization:** Because fraud represents <0.17% of transactions, standard accuracy is a flawed metric. The network evaluates strictly on Precision-Recall AUC (PR-AUC) and exact confusion matrix counts, enforcing a rigid `0.15` decision threshold to prioritize high recall.
* **Data Leakage Prevention:** The local ETL pipeline applies `RobustScaler` and `SMOTE` (Synthetic Minority Over-sampling Technique) strictly to the training subsets *after* the train/test split, ensuring the validation data remains pristine and mathematically honest.
* **Hardware Heterogeneity & Mesh Networking:** The system dynamically binds to CUDA or CPU depending on the node's hardware. Communication bypasses traditional cloud vulnerabilities using a private, peer-to-peer Tailscale mesh network.

---

## 💻 Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Machine Learning Engine** | PyTorch, Scikit-Learn, Pandas, Imbalanced-Learn |
| **Federated Orchestration** | Flower (flwr), FedAvg, FedProx |
| **Networking & Security** | Tailscale (P2P Mesh), gRPC, Bandit (SAST) |
| **Backend & Dashboard** *(Upcoming)*| FastAPI, Uvicorn, Python 3.11, React, Next.js |

---

## 📂 Repository Structure

```bash
NexusFL/
│
├── .github/workflows/       # CI/CD pipelines (Bandit SAST, formatting)
├── .pre-commit-config.yaml  # Static analysis and trailing whitespace hooks
│
├── backend/                 # Core Federated Learning Environment
│   ├── data/                # [IGNORED] Kaggle CSV and generated .pt tensors
│   ├── adapter.py           # ETL pipeline: non-IID partitioning & SMOTE
│   ├── model.py             # 3-layer PyTorch MLP (4,129 parameters)
│   ├── client.py            # Local edge node training loop & metric extraction
│   ├── server.py            # Flower central orchestrator (FedProx aggregation)
│   └── SETUP.md             # Detailed hardware & networking setup guide
│
└── frontend/                # [Phase 2] React / Next.js Web App
```

---

## 🚀 Getting Started (Federated Simulation)

### 1. Prerequisites
* Python 3.11+
* Kaggle API token (`kaggle.json`) installed in `~/.kaggle/`

### 2. Environment Setup
Clone the repository and set up your virtual environment:

```bash
git clone https://github.com/your-username/NexusFL.git
cd NexusFL/backend

# Set up and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install flwr pandas scikit-learn imbalanced-learn kaggle torch
```

### 3. Data Ingestion & ETL
Download the Kaggle Credit Card dataset and generate the simulated bank nodes:

```bash
mkdir -p data
kaggle datasets download -d mlg-ulb/creditcardfraud -p data --unzip
python adapter.py
```

### 4. Run the Network (Local or Tailscale)
Open three separate terminal windows (ensure `.venv` is activated in each). 

**Terminal 1 (The Orchestrator):**

```bash
python server.py
```

**Terminal 2 (Bank Node 1):**

```bash
# Replace 127.0.0.1 with the server's Tailscale IP if running across different machines
python client.py --cid=bank_1 --server=127.0.0.1:8081
```

**Terminal 3 (Bank Node 2):**

```bash
python client.py --cid=bank_2 --server=127.0.0.1:8081
```

*Training will automatically trigger when the minimum client threshold is met.*

---

## 🗺️ Project Roadmap
- [x] **Sprint 1:** Architecture design, PyTorch MLP construction, and evaluation metric shift to PR-AUC.
- [x] **Sprint 2:** Homogeneous (IID) federated network setup using Flower; successful FedAvg baseline established.
- [x] **Sprint 3:** Heterogeneous (Non-IID) data simulation; system upgraded to FedProx to successfully mitigate client drift.
- [ ] **Sprint 4:** Decoupled FastAPI integration and REST endpoints for model inference.
- [ ] **Sprint 5:** Next.js React dashboard development for real-time visualization of network convergence.

---

## 👥 Team & Academic Context
Developed within the Information Technology Department at **A. P. Shah Institute of Technology (APSIT), Mumbai University**.

* **Kaushik Naik** — *Lead ML & Systems Architect*
  Designed the core Federated Learning pipeline, engineered the PyTorch MLP, enforced the PR-AUC evaluation matrix, and developed the non-IID data partitioning logic.
* **Nitesh Pangle** — *GPU Infrastructure & Orchestration Lead*
  Responsible for managing the high-compute (RTX 3050/CUDA) node, orchestrating the global `server.py` aggregation rounds, and maintaining the Tailscale mesh network topology. 
* **Aditya Mishra** — *Edge-Node Analyst & Validation Lead*
  Responsible for simulating low-compute edge banking environments (CPU node), executing client-side benchmarks, and managing the project's analytical presentation (Business Tradeoff Matrix).

---
**License:** MIT License

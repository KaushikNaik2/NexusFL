# NexusFL: Federated Learning Backend Setup

This guide covers the setup, data ingestion, and execution of the NexusFL federated learning pipeline. The architecture uses FedProx to train on Non-IID (heterogeneous) data across distributed nodes.

## 1. Environment Setup

All commands should be run from inside the backend/ directory.

Create and activate the virtual environment:

Linux / macOS:
    python3 -m venv .venv
    source .venv/bin/activate

Windows (Command Prompt):
    .venv\Scripts\activate


## 2. Dependency Installation

First, install the core Python libraries required for data processing and orchestration:

    pip install flwr pandas scikit-learn imbalanced-learn kaggle

Install PyTorch:
You must install the correct version of PyTorch depending on your hardware.

For Standard Laptops (CPU Only):
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

For the RTX 3050 Machine (CUDA / GPU):
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124

(Verify CUDA is active by running: python -c "import torch; print(torch.cuda.is_available())". It should print True.)


## 3. Data Ingestion & ETL (One-Time Setup)

The system requires the Kaggle Credit Card Fraud dataset.
Note: You must have a kaggle.json API token installed in ~/.kaggle/ (Linux/Mac) or C:\Users\<User>\.kaggle\ (Windows).

Download the dataset and run the adapter:

    mkdir -p data
    kaggle datasets download -d mlg-ulb/creditcardfraud -p data --unzip
    python adapter.py

If successful, adapter.py will print the specific train/validation tensor shapes and the simulated fraud distribution for bank_1 and bank_2.


## 4. Running the Simulation (Local Testing)

To verify the code works before networking multiple machines, run the server and clients on your local machine using three separate terminal windows. You must activate the virtual environment (source .venv/bin/activate) in every new terminal.

Terminal 1 (The Orchestrator):
    python server.py

Terminal 2 (Client Node 1):
    python client.py --cid=bank_1 --server=127.0.0.1:8081

Terminal 3 (Client Node 2):
    python client.py --cid=bank_2 --server=127.0.0.1:8081

Training will automatically begin the moment Terminal 3 connects. It will execute 5 rounds of FedProx.


## 5. Running the Simulation (Tailscale Mesh Network)

To run a genuine distributed training session across different machines:

1. Connect to Tailscale: Ensure all participating machines are authenticated to the same Tailscale network.
2. Identify the Server IP: The person hosting server.py needs to find their Tailscale IP (e.g., 100.x.y.z).
    Linux: Run tailscale ip -4
    Windows: Click the Tailscale system tray icon.
3. Start the Server: The host starts the server normally. It binds to 0.0.0.0:8081 by default, exposing it to the mesh.
    python server.py
4. Connect the Clients: Teammates launch their client scripts, replacing 127.0.0.1 with the host's Tailscale IP.
    python client.py --cid=bank_1 --server=100.x.y.z:8081
    python client.py --cid=bank_2 --server=100.x.y.z:8081


## Troubleshooting

- Port 8081 in use: If the server crashes on startup because the port is blocked, kill the zombie Python process:
    Linux: kill -9 $(lsof -t -i:8081)

- FileNotFoundError (bank_1_train.pt): You forgot to run python adapter.py. The local training tensors must be generated before clients can start.

- Git hanging on commit: Ensure data/ is strictly listed in your .gitignore file. Never commit the 150MB CSV or the generated .pt files.

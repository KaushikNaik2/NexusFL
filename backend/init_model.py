"""
NexusFL Model Initializer
Instantiates FraudMLP and saves canonical PyTorch checkpoint weights to global_model.pt.
"""

import os
import sys

# Ensure backend root is in python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    import torch
    from model import FraudMLP

    def generate_checkpoint(output_path: str = "global_model.pt"):
        target = os.path.join(backend_dir, output_path)
        print(f"Initializing FraudMLP architecture (4,129 parameters)...")
        model = FraudMLP(input_dim=30)
        torch.save(model.state_dict(), target)
        print(f"Successfully saved checkpoint to: {target}")
        print(f"File size: {os.path.getsize(target)} bytes")

    if __name__ == "__main__":
        generate_checkpoint()

except ImportError as e:
    print(f"PyTorch not available in current environment: {e}")
    sys.exit(1)

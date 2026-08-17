# NexusFL: Privacy-Preserving Financial Fraud Detection 🛡️💳

> **Breaking the Data Silo Paradox in modern finance through Horizontal Federated Learning.**

NexusFL is a decoupled, distributed machine learning architecture designed to detect cross-institutional credit card fraud. By leveraging **Horizontal Federated Learning (FL)**, NexusFL enables competing financial institutions to collaboratively train a unified global AI model without ever transmitting raw, sensitive customer data (PII) over the network, ensuring strict compliance with data residency and privacy laws (e.g., GDPR, DPDP Act).

---

## 🎯 The Problem: The Data Silo Paradox
Financial institutions lose billions annually to sophisticated, cross-network fraud schemes. While they possess the data to stop it, strict privacy regulations prevent them from pooling their datasets to train a collective AI model. Traditional centralized machine learning requires creating massive, highly vulnerable data honeypots. 

**Our Solution:** Move the computation to the data. 

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

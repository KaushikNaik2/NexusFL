-- NexusFL Security & Audit Logging Schema (PostgreSQL)
-- Phase 2 Persistent State

CREATE TABLE IF NOT EXISTS analysts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(30) DEFAULT 'FRAUD_ANALYST',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(64) NOT NULL,
    client_bank VARCHAR(32) NOT NULL,
    fraud_probability NUMERIC(6, 5) NOT NULL,
    threshold_applied NUMERIC(4, 2) DEFAULT 0.15,
    status VARCHAR(30) DEFAULT 'PENDING_REVIEW', -- 'PENDING_REVIEW', 'CONFIRMED_FRAUD', 'FALSE_POSITIVE'
    reviewed_by INTEGER REFERENCES analysts(id),
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    analyst_id INTEGER REFERENCES analysts(id),
    transaction_id VARCHAR(64),
    ip_address VARCHAR(45),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial security analyst account
INSERT INTO analysts (username, email, role)
VALUES 
    ('aditya_analyst', 'aditya.analyst@nexusfl.local', 'LEAD_ANALYST'),
    ('nitesh_infra', 'nitesh.infra@nexusfl.local', 'SYSTEM_ADMIN'),
    ('kaushik_architect', 'kaushik.architect@nexusfl.local', 'SYSTEM_AUDITOR')
ON CONFLICT (username) DO NOTHING;

-- Seed an example high-risk alert for dashboard preview
INSERT INTO alerts (transaction_id, client_bank, fraud_probability, threshold_applied, status)
VALUES 
    ('TX-B1-99281', 'bank_1', 0.84210, 0.15, 'PENDING_REVIEW'),
    ('TX-B2-10824', 'bank_2', 0.23150, 0.15, 'PENDING_REVIEW'),
    ('TX-B1-74621', 'bank_1', 0.04120, 0.15, 'FALSE_POSITIVE')
ON CONFLICT DO NOTHING;


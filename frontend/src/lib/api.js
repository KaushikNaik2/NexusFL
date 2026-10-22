// NexusFL API Client & Simulation Engine
// Connects to FastAPI Backend with Automatic Local Enclave Fallback

export function getApiBase() {
  if (typeof window !== "undefined") {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (window.location.port !== "3000") return "/api";
  }
  return "http://localhost:8000";
}

export async function checkHealth() {
  const apiBase = getApiBase();
  const t0 = performance.now();
  try {
    const res = await fetch(`${apiBase}/health`, { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = await res.json();
      return {
        connected: true,
        framework: data.framework || "PyTorch",
        device: data.device || "cpu",
        latency: Math.round(performance.now() - t0),
      };
    }
  } catch {
    // Offline mode
  }
  return { connected: false, framework: "Standby (Simulated)", device: "Edge Enclave", latency: 2 };
}

export async function predictTransaction({ features, transactionId, bankId = "bank_1", isHighRisk = false }) {
  const apiBase = getApiBase();
  const start = performance.now();

  try {
    const res = await fetch(`${apiBase}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        features,
        transaction_id: transactionId,
      }),
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        id: data.transaction_id || transactionId,
        probability: data.fraud_probability,
        is_fraud: data.is_fraud,
        threshold_applied: data.threshold_applied,
        latencyMs: data.latency_ms,
        isSimulated: false,
      };
    }
  } catch {
    // Graceful fallback to client mathematical evaluation
  }

  // Client-side fallback matching FraudMLP sigmoid bounds
  const prob = isHighRisk
    ? parseFloat((0.16 + Math.random() * 0.78).toFixed(4))
    : parseFloat((0.001 + Math.random() * 0.08).toFixed(4));
  const isFraud = prob >= 0.15;
  const latencyMs = parseFloat((performance.now() - start + 1.2).toFixed(2));

  return {
    id: transactionId,
    probability: prob,
    is_fraud: isFraud,
    threshold_applied: 0.15,
    latencyMs,
    isSimulated: true,
  };
}

export async function submitAlertAudit(transactionId, status, notes) {
  const apiBase = getApiBase();
  try {
    const res = await fetch(`${apiBase}/alerts/audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transaction_id: transactionId,
        status,
        notes: notes || "Audited by Security Analyst",
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function loginUser(credentials) {
  const apiBase = getApiBase();
  try {
    const res = await fetch(`${apiBase}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      signal: AbortSignal.timeout(3500),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, user: data.user };
    }
  } catch {
    // Fallback handled in UI
  }
  return { success: false };
}

export async function signupUser(details) {
  const apiBase = getApiBase();
  try {
    const res = await fetch(`${apiBase}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
      signal: AbortSignal.timeout(3500),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, user: data.user };
    }
    const errData = await res.json().catch(() => null);
    return { success: false, detail: errData?.detail };
  } catch {
    return { success: false };
  }
}

// Generate canonical 30-feature vector [Scaled Time, V1..V28, Scaled Amount]
export function generateCanonicalTensor(isHighRisk = false) {
  const amount = isHighRisk
    ? parseFloat((250 + Math.random() * 4500).toFixed(2))
    : parseFloat((8 + Math.random() * 220).toFixed(2));

  // Construct 28 PCA features adhering to fraud distribution
  const pca = Array.from({ length: 28 }, (_, i) => {
    if (isHighRisk && (i === 3 || i === 11 || i === 13)) {
      // V4 is positive in anomalies; V12 and V14 are deeply negative
      return i === 3
        ? parseFloat((3.6 + Math.random() * 2.8).toFixed(4))
        : parseFloat((-5.2 + Math.random() * 2.2).toFixed(4));
    }
    return parseFloat(((Math.random() - 0.5) * 0.75).toFixed(4));
  });

  const features = [0.0, ...pca, amount];
  return { features, amount, pcaHighlights: { v4: pca[3], v12: pca[11], v14: pca[13] } };
}

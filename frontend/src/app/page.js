"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ShieldAlert,
  Network,
  Activity,
  FileCheck,
  Lock,
  Scale,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Server,
  Clock,
  ArrowUpRight,
  BarChart3,
  Database,
  Key,
  RefreshCw,
  Play,
  Pause,
  Sliders,
  Home,
  Sparkles,
  Zap,
  ChevronRight,
  X,
  User,
  LogIn,
  LogOut,
  UserPlus,
  Building2,
  ArrowLeft,
  ShieldCheck,
  Mail,
  KeyRound,
} from "lucide-react";

// Initial mock transactions simulating decentralized bank streams
const INITIAL_TRANSACTIONS = [
  {
    id: "TX-B1-99281",
    bank: "bank_1 (Relational SQL)",
    time: "10:42:15 AM",
    amount: 1420.5,
    probability: 0.842,
    is_fraud: true,
    pcaHighlights: { v4: 4.82, v12: -5.14, v14: -6.02 },
    status: "CRITICAL_ALERT",
  },
  {
    id: "TX-B2-10824",
    bank: "bank_2 (NoSQL JSON)",
    time: "10:42:30 AM",
    amount: 38.75,
    probability: 0.012,
    is_fraud: false,
    pcaHighlights: { v4: 0.12, v12: -0.04, v14: 0.08 },
    status: "APPROVED",
  },
  {
    id: "TX-B1-74621",
    bank: "bank_1 (Relational SQL)",
    time: "10:42:48 AM",
    amount: 320.0,
    probability: 0.231,
    is_fraud: true,
    pcaHighlights: { v4: 2.15, v12: -2.8, v14: -3.1 },
    status: "CRITICAL_ALERT",
  },
  {
    id: "TX-B2-44109",
    bank: "bank_2 (NoSQL JSON)",
    time: "10:43:02 AM",
    amount: 12.99,
    probability: 0.004,
    is_fraud: false,
    pcaHighlights: { v4: -0.1, v12: 0.05, v14: 0.01 },
    status: "APPROVED",
  },
  {
    id: "TX-B1-55812",
    bank: "bank_1 (Relational SQL)",
    time: "10:43:18 AM",
    amount: 980.2,
    probability: 0.174,
    is_fraud: true,
    pcaHighlights: { v4: 1.84, v12: -1.95, v14: -2.3 },
    status: "CRITICAL_ALERT",
  },
];

// Federated rounds data (Performance metrics)
const FEDERATED_ROUNDS_DATA = [
  { round: 1, globalPrAuc: 0.612, bank1PrAuc: 0.584, bank2PrAuc: 0.541, loss: 0.245, weightDrift: 0.112 },
  { round: 2, globalPrAuc: 0.678, bank1PrAuc: 0.631, bank2PrAuc: 0.602, loss: 0.198, weightDrift: 0.095 },
  { round: 3, globalPrAuc: 0.724, bank1PrAuc: 0.682, bank2PrAuc: 0.654, loss: 0.162, weightDrift: 0.081 },
  { round: 4, globalPrAuc: 0.761, bank1PrAuc: 0.711, bank2PrAuc: 0.688, loss: 0.138, weightDrift: 0.072 },
  { round: 5, globalPrAuc: 0.789, bank1PrAuc: 0.732, bank2PrAuc: 0.705, loss: 0.121, weightDrift: 0.063 },
  { round: 6, globalPrAuc: 0.808, bank1PrAuc: 0.745, bank2PrAuc: 0.712, loss: 0.109, weightDrift: 0.056 },
  { round: 7, globalPrAuc: 0.822, bank1PrAuc: 0.751, bank2PrAuc: 0.718, loss: 0.099, weightDrift: 0.051 },
  { round: 8, globalPrAuc: 0.831, bank1PrAuc: 0.756, bank2PrAuc: 0.721, loss: 0.093, weightDrift: 0.047 },
  { round: 9, globalPrAuc: 0.838, bank1PrAuc: 0.759, bank2PrAuc: 0.723, loss: 0.089, weightDrift: 0.044 },
  { round: 10, globalPrAuc: 0.842, bank1PrAuc: 0.761, bank2PrAuc: 0.724, loss: 0.086, weightDrift: 0.042 },
];

// Cryptographic Checkpoints Ledger
const CRYPTO_LEDGER = [
  { round: 10, hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", algo: "FedAvg", timestamp: "10:35:12 AM", status: "VERIFIED" },
  { round: 9, hash: "7d1a54127b222502f5b79b5fb08030ec61590141e3b9ce7779e0114238824350", algo: "FedAvg", timestamp: "10:15:00 AM", status: "VERIFIED" },
  { round: 8, hash: "3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1", algo: "FedAvg", timestamp: "09:54:22 AM", status: "VERIFIED" },
  { round: 7, hash: "185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969", algo: "FedAvg", timestamp: "09:34:10 AM", status: "VERIFIED" },
];

// Persona Profiles for Instant 1-Click Access & Credential Authentication
const DEMO_PERSONAS = [
  {
    role: "manager",
    title: "Bank Manager",
    badgeColor: "bg-[#ffc94a]",
    name: "Dr. Vikram Seth",
    email: "manager@hdfc-node.internal",
    institution: "Bank 1 (Relational SQL Node Alpha)",
    nodeId: "NODE-ALPHA-B1",
    description: "Executive ROI, fraud loss prevention, false positive reduction & SLA dashboards",
    defaultTab: "manager",
    iconEmoji: "👔",
  },
  {
    role: "admin",
    title: "Platform Admin",
    badgeColor: "bg-[#8987f5]",
    name: "Anya Rostova",
    email: "admin@nexusfl.mesh",
    institution: "Central Flower FL Parameter Server",
    nodeId: "COORDINATOR-01",
    description: "FedProx aggregation rounds, gradient drift, Byzantine defense controls",
    defaultTab: "admin",
    iconEmoji: "⚡",
  },
  {
    role: "analyst",
    title: "Fraud Analyst",
    badgeColor: "bg-[#48b9f2]",
    name: "Karan Johar",
    email: "analyst@bank2-risk.corp",
    institution: "Bank 2 (NoSQL JSON Node Beta)",
    nodeId: "NODE-BETA-B2",
    description: "Live transaction streaming, PCA vector triage, 0.15 threshold verdicts",
    defaultTab: "analyst",
    iconEmoji: "🔍",
  },
  {
    role: "secops",
    title: "SecOps Auditor",
    badgeColor: "bg-[#b9ed48]",
    name: "Elena Rostova",
    email: "secops@nexus-audit.gov",
    institution: "Global Security Enclave",
    nodeId: "AUDIT-CORE-9",
    description: "Cryptographic weight ledgers, token revocation, TLS WireGuard audits",
    defaultTab: "secops",
    iconEmoji: "🛡️",
  },
];

export default function NexusFLPlatform() {
  // View mode: "welcome" (Landing) | "login" | "signup" | "dashboard"
  const [currentView, setCurrentView] = useState("welcome");
  // Navigation Role: "analyst" | "admin" | "secops" | "manager"
  const [activeRole, setActiveRole] = useState("manager");
  const [mounted, setMounted] = useState(false);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState(DEMO_PERSONAS[0]);

  // Auth form states
  const [loginForm, setLoginForm] = useState({
    email: "manager@hdfc-node.internal",
    password: "••••••••••••",
    role: "manager",
    institution: "Bank 1 (Relational SQL Node Alpha)",
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    institution: "Bank 1 (Relational SQL Node Alpha)",
    role: "manager",
    nodeType: "sql",
    password: "",
  });

  const [authError, setAuthError] = useState("");

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveRole(user.role || "manager");
    setCurrentView("dashboard");
    setAuditNotice(`Session Authenticated: ${user.name} logged in as ${user.title || user.role.toUpperCase()}`);
    setTimeout(() => setAuditNotice(null), 5000);
  };

  const handleLogout = () => {
    setCurrentView("welcome");
    setAuditNotice("Session closed. Returned to Landing Matrix.");
    setTimeout(() => setAuditNotice(null), 4000);
  };
  // Dynamic API Base resolution
  const apiBase = useMemo(() => {
    if (typeof window !== "undefined") {
      if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
      if (window.location.port !== "3000") return "/api";
    }
    return "http://localhost:8000";
  }, []);

  const handleFormLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
          role: loginForm.role,
          institution: loginForm.institution,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        handleLoginSuccess(data.user);
        return;
      }
    } catch {
      // Graceful fallback to client persona evaluation
    }

    const matched = DEMO_PERSONAS.find((p) => p.role === loginForm.role) || DEMO_PERSONAS[0];
    const user = {
      ...matched,
      email: loginForm.email || matched.email,
      institution: loginForm.institution || matched.institution,
    };
    handleLoginSuccess(user);
  };

  const handleFormSignup = async (e) => {
    e.preventDefault();
    if (!signupForm.name.trim() || !signupForm.email.trim()) {
      setAuthError("Please provide both name and corporate email.");
      setTimeout(() => setAuthError(""), 3500);
      return;
    }
    try {
      const res = await fetch(`${apiBase}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupForm.name.trim(),
          email: signupForm.email.trim(),
          institution: signupForm.institution || "Bank Enclave Node",
          role: signupForm.role,
          node_type: signupForm.nodeType || "sql",
          password: signupForm.password || "demo_passkey",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        handleLoginSuccess(data.user);
        return;
      } else {
        const errData = await res.json().catch(() => null);
        if (errData?.detail) {
          setAuthError(errData.detail);
          setTimeout(() => setAuthError(""), 4000);
          return;
        }
      }
    } catch {
      // Graceful fallback
    }

    const matched = DEMO_PERSONAS.find((p) => p.role === signupForm.role) || DEMO_PERSONAS[0];
    const user = {
      ...matched,
      name: signupForm.name.trim(),
      email: signupForm.email.trim(),
      institution: signupForm.institution || `${signupForm.name}'s Institution Node`,
    };
    handleLoginSuccess(user);
  };

  // Analyst state
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [selectedTx, setSelectedTx] = useState(INITIAL_TRANSACTIONS[0]);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [decisionThreshold] = useState(0.15); // Fixed operational constraint
  const [auditNotice, setAuditNotice] = useState(null);
  const [apiStatus, setApiStatus] = useState({ connected: false, framework: "Checking...", latency: 0 });
  const [currentTime, setCurrentTime] = useState("");

  // SecOps state
  const [nodeTokens, setNodeTokens] = useState({ bank1: "REVOKED_NO", bank2: "REVOKED_NO" });
  const [freezeEdgeSync, setFreezeEdgeSync] = useState(false);

  // Clock
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date().toUTCString().slice(17, 25) + " UTC");
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll backend health status
  useEffect(() => {
    const checkHealth = async () => {
      const t0 = performance.now();
      try {
        const res = await fetch(`${apiBase}/health`);
        if (res.ok) {
          const data = await res.json();
          setApiStatus({
            connected: true,
            framework: data.framework || "PyTorch",
            device: data.device || "cpu",
            latency: Math.round(performance.now() - t0),
          });
          return;
        }
      } catch {
        // Fallback simulation mode
      }
      setApiStatus({ connected: false, framework: "Offline / Standby", latency: 0 });
    };

    checkHealth();
    const interval = setInterval(checkHealth, 8000);
    return () => clearInterval(interval);
  }, [apiBase]);

  // Execute inference with graceful fallback
  const executeInference = useCallback(
    async (bankId, isHighRisk) => {
      const id = `TX-${bankId === "bank_1" ? "B1" : "B2"}-${Math.floor(10000 + Math.random() * 90000)}`;
      const now = new Date().toLocaleTimeString();
      const amount = isHighRisk
        ? parseFloat((250 + Math.random() * 3500).toFixed(2))
        : parseFloat((5 + Math.random() * 180).toFixed(2));

      // Construct realistic 28 PCA features
      const pca = Array.from({ length: 28 }, (_, i) => {
        if (isHighRisk && (i === 3 || i === 11 || i === 13)) {
          return i === 3
            ? parseFloat((3.5 + Math.random() * 2.5).toFixed(4))
            : parseFloat((-5.0 + Math.random() * 2.0).toFixed(4));
        }
        return parseFloat(((Math.random() - 0.5) * 0.8).toFixed(4));
      });

      const canonicalFeatures = [0.0, ...pca, amount];

      try {
        const res = await fetch(`${apiBase}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            features: canonicalFeatures,
            transaction_id: id,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const newTx = {
            id: data.transaction_id || id,
            bank: bankId === "bank_1" ? "bank_1 (Relational SQL)" : "bank_2 (NoSQL JSON)",
            time: now,
            amount,
            probability: data.fraud_probability,
            is_fraud: data.is_fraud,
            pcaHighlights: {
              v4: pca[3],
              v12: pca[11],
              v14: pca[13],
            },
            latencyMs: data.latency_ms,
            status: data.is_fraud ? "CRITICAL_ALERT" : "APPROVED",
          };
          setTransactions((prev) => [newTx, ...prev.slice(0, 49)]);
          if (data.is_fraud) setSelectedTx(newTx);
          return newTx;
        }
      } catch {
        // Fallback simulation
      }

      // Local mathematical fallback
      const prob = isHighRisk
        ? parseFloat((0.16 + Math.random() * 0.78).toFixed(3))
        : parseFloat((0.001 + Math.random() * 0.08).toFixed(3));
      const isFraud = prob >= decisionThreshold;
      const fallbackTx = {
        id,
        bank: bankId === "bank_1" ? "bank_1 (Relational SQL)" : "bank_2 (NoSQL JSON)",
        time: now,
        amount,
        probability: prob,
        is_fraud: isFraud,
        pcaHighlights: {
          v4: isHighRisk ? 3.84 : 0.14,
          v12: isHighRisk ? -4.92 : -0.05,
          v14: isHighRisk ? -5.88 : 0.02,
        },
        status: isFraud ? "CRITICAL_ALERT" : "APPROVED",
      };
      setTransactions((prev) => [fallbackTx, ...prev.slice(0, 49)]);
      if (fallbackTx.is_fraud) setSelectedTx(fallbackTx);
      return fallbackTx;
    },
    [apiBase, decisionThreshold]
  );

  // Live simulation streamer
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      const isHighRisk = Math.random() < 0.28;
      const bank = Math.random() < 0.5 ? "bank_1" : "bank_2";
      executeInference(bank, isHighRisk);
    }, 2800);
    return () => clearInterval(interval);
  }, [isLiveStreaming, executeInference]);

  // Analyst Action Handlers
  const handleConfirmFraud = async (tx) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === tx.id ? { ...t, status: "CONFIRMED_FRAUD" } : t))
    );
    try {
      await fetch(`${apiBase}/alerts/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id: tx.id,
          status: "CONFIRMED_FRAUD",
          notes: "Confirmed by security analyst. Transaction frozen.",
        }),
      });
    } catch {
      // offline
    }
    setAuditNotice(`Transaction ${tx.id} confirmed as FRAUD. Edge bank node notified.`);
    setTimeout(() => setAuditNotice(null), 4500);
  };

  const handleOverrideFalsePositive = async (tx) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === tx.id ? { ...t, status: "FALSE_POSITIVE" } : t))
    );
    try {
      await fetch(`${apiBase}/alerts/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id: tx.id,
          status: "FALSE_POSITIVE",
          notes: "Overridden by analyst. Model anomaly within legitimate variance.",
        }),
      });
    } catch {
      // offline
    }
    setAuditNotice(`Transaction ${tx.id} marked FALSE POSITIVE. Model override logged.`);
    setTimeout(() => setAuditNotice(null), 4500);
  };

  // ==========================================
  // VIEW 1: WELCOME SCREEN (Neo-Brutalist Landing Page)
  // ==========================================
  if (currentView === "welcome") {
    return (
      <div id="welcome-page" className="app-screen relative w-full overflow-hidden px-5 md:px-10 bg-[#fbf8ef] min-h-screen">
        {/* Playful Floating Geometric Shapes */}
        <div
          aria-hidden="true"
          className="absolute -left-10 top-14 h-28 w-28 rotate-12 rounded-[24px] border-[3px] border-black bg-[#b9ed48] shadow-[4px_4px_0px_#171717]"
        ></div>
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-8 h-40 w-40 rounded-full border-[3px] border-black bg-[#ffc94a] shadow-[4px_4px_0px_#171717]"
        ></div>

        {/* Top Navbar */}
        <header className="relative z-10 mx-auto flex h-[76px] w-full max-w-7xl items-center justify-between border-b-[3px] border-black">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[12px] border-[3px] border-black bg-[#8987f5] shadow-[2.5px_2.5px_0px_#171717]">
              <ShieldAlert className="h-6 w-6 text-black" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-[.16em] block">
                NexusFL // Matrix 01
              </span>
              <span className="text-[10px] font-bold text-black/60 hidden sm:block">
                Zero-Trust Federated Banking Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] mr-2">
              <span className="h-3 w-3 rounded-full border-2 border-black bg-[#48b9f2] animate-pulse"></span>
              Zero Raw Data Leakage
            </div>
            <button
              onClick={() => setCurrentView("login")}
              className="neo-button flex items-center gap-1.5 bg-[#fffaf0] px-3.5 py-1.5 text-xs font-extrabold"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => setCurrentView("signup")}
              className="neo-button flex items-center gap-1.5 bg-[#b9ed48] px-3.5 py-1.5 text-xs font-black"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Sign Up</span>
            </button>
            <button
              onClick={() => setCurrentView("login")}
              className="neo-button flex items-center gap-1.5 bg-[#ffc94a] px-4 py-1.5 text-xs font-extrabold"
            >
              <span>Open Live Console →</span>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="relative z-10 mx-auto grid min-h-[calc(100vh-100px)] w-full max-w-7xl items-center gap-8 py-8 md:grid-cols-[.95fr_1.05fr] lg:gap-14">
          <section className="slide-up max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border-[3px] border-black bg-[#48b9f2] px-4 py-2 text-xs font-black uppercase tracking-[.14em] shadow-[3px_3px_0px_#171717]">
              <span className="h-2.5 w-2.5 rounded-full bg-black"></span>
              Protect Smarter • FedAvg 10R
            </div>

            <h1 className="mb-5 leading-[.85]">
              <span className="display-type block text-6xl md:text-7xl font-black text-[#171717]">
                NexusFL
              </span>
              <span className="display-type flex items-baseline whitespace-nowrap text-6xl md:text-7xl font-black text-[#625fe8]">
                FraudMatrix
              </span>
            </h1>

            <p className="mb-6 max-w-lg text-lg font-medium text-[#292929] leading-relaxed">
              Turn your decentralized bank streams into a rock-solid, privacy-preserving fraud defense in minutes.
              Real-time edge scoring, Byzantine gradient poisoning protection, and strict 0.15 cutoff threshold.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                type="button"
                className="neo-button px-6 py-3 text-base bg-[#ffc94a] text-black font-extrabold shadow-[4px_4px_0px_#171717] flex items-center gap-2"
                onClick={() => setCurrentView("login")}
              >
                <LogIn className="h-4 w-4" />
                Launch Live Console (Sign In) →
              </button>

              <button
                type="button"
                className="neo-button px-5 py-3 text-base bg-[#b9ed48] text-black font-extrabold shadow-[4px_4px_0px_#171717] flex items-center gap-2"
                onClick={() => setCurrentView("signup")}
              >
                <UserPlus className="h-4 w-4" />
                Create Node Account
              </button>

              <div className="neo-pill bg-[#fffaf0] text-black">
                PyTorch • Flower 1.7
              </div>
            </div>

            {/* Quick 1-Click Direct Demo Persona Access */}
            <div className="p-4 rounded-[18px] border-[2.5px] border-black bg-[#fffaf0] shadow-[3px_3px_0px_#171717]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-black/75 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#625fe8]" /> Quick 1-Click Persona Evaluation:
                </span>
                <span className="text-[9px] font-bold bg-[#ffc94a] px-2 py-0.5 rounded-full border border-black">
                  Instant Access
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DEMO_PERSONAS.map((persona) => (
                  <button
                    key={persona.role}
                    onClick={() => handleLoginSuccess(persona)}
                    className={`neo-button text-xs py-2 px-2.5 ${persona.badgeColor} text-black font-extrabold flex flex-col items-center justify-center gap-1 shadow-[2px_2px_0px_#171717] hover:brightness-105`}
                    title={`Instant login as ${persona.title}`}
                  >
                    <span className="text-base">{persona.iconEmoji}</span>
                    <span className="text-[10px] leading-tight text-center">{persona.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Interactive Hero Preview Card */}
          <section
            className="preview-card relative mx-auto w-full max-w-[540px] rounded-[26px] border-[3px] border-black bg-[#8987f5] p-5 shadow-[6px_6px_0px_#171717]"
            aria-label="NexusFL live stream preview"
          >
            <div className="mb-3 flex items-center justify-between rounded-[16px] border-[3px] border-black bg-[#fffaf0] px-4 py-2.5 shadow-[2px_2px_0px_#171717]">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[.18em]">MESH ENCLAVE</p>
                <p className="text-lg font-black leading-tight">Live Edge Stream</p>
              </div>
              <div className="rounded-xl border-[3px] border-black bg-[#b9ed48] px-3.5 py-1.5 text-center shadow-[2px_2px_0px_#171717]">
                <span className="block text-xl font-black leading-none">0.842</span>
                <span className="text-[8px] font-black uppercase tracking-widest">PR-AUC</span>
              </div>
            </div>

            <div className="editorial-grid rounded-[18px] border-[3px] border-black bg-[#fbf8ef] p-4 shadow-[2px_2px_0px_#171717]">
              <div className="mx-auto mb-3 w-48 rounded-xl border-[3px] border-black bg-[#171717] px-3 py-1.5 text-center text-[11px] font-black uppercase tracking-widest text-white shadow-[2px_2px_0px_#8987f5]">
                Coordinator (FedAvg)
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div
                  onClick={() => handleLoginSuccess(DEMO_PERSONAS[0])}
                  className="rounded-xl border-[2.5px] border-black bg-[#b9ed48] p-2.5 text-xs font-bold shadow-[2px_2px_0px_#171717] cursor-pointer hover:brightness-105"
                  title="Click to view Node Alpha"
                >
                  <div className="text-[9px] font-black uppercase text-black/70">Node Alpha</div>
                  <div className="font-mono font-black text-black">TX-B1-99281</div>
                  <div className="text-[10px] font-bold text-red-900 mt-0.5">Prob: 0.842 (Alert)</div>
                </div>

                <div
                  onClick={() => handleLoginSuccess(DEMO_PERSONAS[2])}
                  className="rounded-xl border-[2.5px] border-black bg-[#fffaf0] p-2.5 text-xs font-bold shadow-[2px_2px_0px_#171717] cursor-pointer hover:brightness-105"
                  title="Click to view Node Beta"
                >
                  <div className="text-[9px] font-black uppercase text-black/70">Node Beta</div>
                  <div className="font-mono font-black text-black">TX-B2-10824</div>
                  <div className="text-[10px] font-bold text-emerald-800 mt-0.5">Prob: 0.012 (Safe)</div>
                </div>

                <div
                  onClick={() => handleLoginSuccess(DEMO_PERSONAS[0])}
                  className="rounded-xl border-[2.5px] border-black bg-[#ffc94a] p-2.5 text-xs font-bold shadow-[2px_2px_0px_#171717] cursor-pointer hover:brightness-105"
                  title="Click to view Node Alpha"
                >
                  <div className="text-[9px] font-black uppercase text-black/70">Node Alpha</div>
                  <div className="font-mono font-black text-black">TX-B1-74621</div>
                  <div className="text-[10px] font-bold text-red-900 mt-0.5">Prob: 0.231 (Alert)</div>
                </div>

                <div
                  onClick={() => handleLoginSuccess(DEMO_PERSONAS[2])}
                  className="rounded-xl border-[2.5px] border-black bg-[#48b9f2] p-2.5 text-xs font-bold shadow-[2px_2px_0px_#171717] cursor-pointer hover:brightness-105"
                  title="Click to view Node Beta"
                >
                  <div className="text-[9px] font-black uppercase text-black/70">Node Beta</div>
                  <div className="font-mono font-black text-black">TX-B2-44109</div>
                  <div className="text-[10px] font-bold text-emerald-800 mt-0.5">Prob: 0.004 (Safe)</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 rotate-[-4deg] rounded-[12px] border-[3px] border-black bg-[#f46455] px-3.5 py-2 text-xs font-black text-white shadow-[3px_3px_0px_#171717]">
              ZERO LEAK • FEDAVG • PROD
            </div>
          </section>
        </main>
      </div>
    );
  }

  // ==========================================
  // VIEW: LOGIN SCREEN (Neo-Brutalist Authentication)
  // ==========================================
  if (currentView === "login") {
    return (
      <div id="login-page" className="app-screen relative w-full overflow-hidden px-5 md:px-10 bg-[#fbf8ef] min-h-screen flex flex-col justify-between py-6">
        {/* Playful Floating Geometric Shapes */}
        <div
          aria-hidden="true"
          className="absolute -left-10 top-14 h-28 w-28 rotate-12 rounded-[24px] border-[3px] border-black bg-[#ffc94a] shadow-[4px_4px_0px_#171717]"
        ></div>
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-8 h-40 w-40 rounded-full border-[3px] border-black bg-[#8987f5] shadow-[4px_4px_0px_#171717]"
        ></div>

        {/* Top Navbar */}
        <header className="relative z-10 mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between border-b-[3px] border-black">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCurrentView("welcome")}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-[12px] border-[3px] border-black bg-[#8987f5] shadow-[2.5px_2.5px_0px_#171717]">
              <ShieldAlert className="h-6 w-6 text-black" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-[.16em] block">
                NexusFL // Access Gateway
              </span>
              <span className="text-[10px] font-bold text-black/60">
                Zero-Trust Secure Enclave Authentication
              </span>
            </div>
          </div>

          <button
            onClick={() => setCurrentView("welcome")}
            className="neo-button flex items-center gap-1.5 bg-[#fffaf0] px-4 py-1.5 text-xs font-extrabold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Landing</span>
          </button>
        </header>

        {/* Login Main Container */}
        <main className="relative z-10 mx-auto w-full max-w-6xl py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: 1-Click Quick Persona Logins */}
            <section className="lg:col-span-5 space-y-4">
              <div className="outlined-panel bg-[#48b9f2] p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="neo-pill bg-[#fffaf0] text-black">Fast Evaluation</span>
                  <Sparkles className="h-4 w-4 text-black" />
                </div>
                <h2 className="display-type text-2xl font-black text-[#171717] mb-1">
                  1-Click Role Access
                </h2>
                <p className="text-xs font-bold text-black/80 leading-relaxed mb-4">
                  Select your operational persona for immediate access to specialized telemetry:
                </p>

                <div className="space-y-2.5">
                  {DEMO_PERSONAS.map((persona) => (
                    <div
                      key={persona.role}
                      onClick={() => handleLoginSuccess(persona)}
                      className="rounded-[14px] border-[2.5px] border-black bg-[#fffaf0] p-3 shadow-[2.5px_2.5px_0px_#171717] cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3.5px_3.5px_0px_#171717] transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{persona.iconEmoji}</span>
                          <span className="text-xs font-black">{persona.title}</span>
                        </div>
                        <span className={`neo-pill py-0.5 px-2 text-[9px] font-black ${persona.badgeColor}`}>
                          {persona.role.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-black/70 line-clamp-1 mb-1.5">
                        {persona.description}
                      </p>
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-black/60 pt-1 border-t border-black/10">
                        <span>{persona.institution}</span>
                        <span className="font-sans font-black text-black flex items-center gap-0.5 text-[11px]">
                          Enter →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zero Knowledge Callout */}
              <div className="outlined-card bg-[#fffaf0] p-4 text-xs font-bold space-y-1">
                <div className="flex items-center gap-1.5 text-black font-black">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  Zero Raw Data Disclosure
                </div>
                <p className="text-black/70 text-[11px] leading-relaxed">
                  Authentication tokens verify role permissions across edge enclaves without transmitting customer PII or raw transaction logs.
                </p>
              </div>
            </section>

            {/* Right Column: Interactive Credentials Form */}
            <section className="lg:col-span-7">
              <div className="outlined-panel bg-[#fffaf0] p-6 md:p-8">
                {/* Form Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b-[2.5px] border-black">
                  <div>
                    <h3 className="display-type text-3xl font-black text-[#171717]">
                      Sign In to Console
                    </h3>
                    <p className="text-xs font-bold text-black/60 mt-1">
                      Enter institutional credentials or switch roles below
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-[14px] border-[2.5px] border-black bg-[#ffc94a] flex items-center justify-center shadow-[2px_2px_0px_#171717]">
                    <LogIn className="h-6 w-6 text-black" />
                  </div>
                </div>

                {authError && (
                  <div className="mb-4 p-3 rounded-xl border-2 border-black bg-[#f46455] text-white text-xs font-black">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleFormLogin} className="space-y-5">
                  {/* Role Selector Segmented Controls */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-2">
                      Operational Role Selection
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {DEMO_PERSONAS.map((p) => (
                        <button
                          type="button"
                          key={p.role}
                          onClick={() => {
                            setLoginForm({
                              ...loginForm,
                              role: p.role,
                              email: p.email,
                              institution: p.institution,
                            });
                          }}
                          className={`neo-button text-xs py-2 px-2 text-center flex items-center justify-center gap-1 ${
                            loginForm.role === p.role
                              ? "bg-[#171717] text-white shadow-[2px_2px_0px_#8987f5]"
                              : "bg-[#fffaf0] text-black"
                          }`}
                        >
                          <span>{p.iconEmoji}</span>
                          <span className="font-extrabold text-[11px] truncate">{p.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Institution Selection */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Bank Institution & Enclave Node
                    </label>
                    <div className="relative">
                      <select
                        value={loginForm.institution}
                        onChange={(e) => setLoginForm({ ...loginForm, institution: e.target.value })}
                        className="w-full rounded-xl border-[2.5px] border-black bg-white p-3 text-xs font-bold text-black shadow-[2px_2px_0px_#171717] appearance-none"
                      >
                        <option value="Bank 1 (Relational SQL Node Alpha)">Bank 1 (Relational SQL Node Alpha)</option>
                        <option value="Bank 2 (NoSQL JSON Node Beta)">Bank 2 (NoSQL JSON Node Beta)</option>
                        <option value="Central Flower FL Parameter Server">Central Coordinator (FedAvg / FedProx Mesh)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 font-black text-black">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Corporate Email Field */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Corporate Work Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        placeholder="manager@bank-node.corp"
                        className="w-full rounded-xl border-[2.5px] border-black bg-white p-3 pl-10 text-xs font-bold text-black shadow-[2px_2px_0px_#171717]"
                      />
                      <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-black/50" />
                    </div>
                  </div>

                  {/* Secret Enclave Key / Password */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Enclave Access Secret Key
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="••••••••••••••••"
                        className="w-full rounded-xl border-[2.5px] border-black bg-white p-3 pl-10 text-xs font-bold text-black shadow-[2px_2px_0px_#171717]"
                      />
                      <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-black/50" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="neo-button w-full bg-[#ffc94a] hover:bg-[#ffbe25] text-black font-black text-sm py-3.5 flex items-center justify-center gap-2 shadow-[4px_4px_0px_#171717]"
                    >
                      <LogIn className="h-4 w-4" />
                      Authenticate & Launch Live Console →
                    </button>
                  </div>

                  {/* Toggle to Register */}
                  <div className="pt-2 text-center">
                    <p className="text-xs font-bold text-black/70">
                      Need to register a new bank node?{" "}
                      <button
                        type="button"
                        onClick={() => setCurrentView("signup")}
                        className="font-black text-[#625fe8] underline hover:text-black"
                      >
                        Create Node Account (Sign Up)
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // VIEW: SIGNUP SCREEN (Node Registration)
  // ==========================================
  if (currentView === "signup") {
    return (
      <div id="signup-page" className="app-screen relative w-full overflow-hidden px-5 md:px-10 bg-[#fbf8ef] min-h-screen flex flex-col justify-between py-6">
        {/* Playful Floating Geometric Shapes */}
        <div
          aria-hidden="true"
          className="absolute -left-10 top-14 h-28 w-28 rotate-12 rounded-[24px] border-[3px] border-black bg-[#b9ed48] shadow-[4px_4px_0px_#171717]"
        ></div>
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-8 h-40 w-40 rounded-full border-[3px] border-black bg-[#48b9f2] shadow-[4px_4px_0px_#171717]"
        ></div>

        {/* Top Navbar */}
        <header className="relative z-10 mx-auto flex h-[72px] w-full max-w-5xl items-center justify-between border-b-[3px] border-black">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCurrentView("welcome")}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-[12px] border-[3px] border-black bg-[#8987f5] shadow-[2.5px_2.5px_0px_#171717]">
              <ShieldAlert className="h-6 w-6 text-black" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-[.16em] block">
                NexusFL // Node Enclave Registration
              </span>
              <span className="text-[10px] font-bold text-black/60">
                Join the Decentralized Banking Federation
              </span>
            </div>
          </div>

          <button
            onClick={() => setCurrentView("welcome")}
            className="neo-button flex items-center gap-1.5 bg-[#fffaf0] px-4 py-1.5 text-xs font-extrabold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Landing</span>
          </button>
        </header>

        {/* Registration Card */}
        <main className="relative z-10 mx-auto w-full max-w-2xl py-8">
          <div className="outlined-panel bg-[#fffaf0] p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-[2.5px] border-black">
              <div>
                <span className="neo-pill bg-[#b9ed48] text-black">New Node Enrollment</span>
                <h3 className="display-type text-3xl font-black text-[#171717] mt-1">
                  Register Bank Node
                </h3>
                <p className="text-xs font-bold text-black/60 mt-1">
                  Enlist your bank in privacy-preserving collaborative model training
                </p>
              </div>
              <div className="h-12 w-12 rounded-[14px] border-[2.5px] border-black bg-[#b9ed48] flex items-center justify-center shadow-[2px_2px_0px_#171717]">
                <UserPlus className="h-6 w-6 text-black" />
              </div>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-xl border-2 border-black bg-[#f46455] text-white text-xs font-black">
                {authError}
              </div>
            )}

            <form onSubmit={handleFormSignup} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full rounded-xl border-[2.5px] border-black bg-white p-3 pl-10 text-xs font-bold text-black shadow-[2px_2px_0px_#171717]"
                    />
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-black/50" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                    Corporate Work Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      placeholder="r.sharma@bankone.corp"
                      className="w-full rounded-xl border-[2.5px] border-black bg-white p-3 pl-10 text-xs font-bold text-black shadow-[2px_2px_0px_#171717]"
                    />
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-black/50" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                  Financial Institution Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={signupForm.institution}
                    onChange={(e) => setSignupForm({ ...signupForm, institution: e.target.value })}
                    placeholder="e.g. HDFC Bank, Axis Bank, Chase"
                    className="w-full rounded-xl border-[2.5px] border-black bg-white p-3 pl-10 text-xs font-bold text-black shadow-[2px_2px_0px_#171717]"
                  />
                  <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-black/50" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                    Primary Operational Role
                  </label>
                  <select
                    value={signupForm.role}
                    onChange={(e) => setSignupForm({ ...signupForm, role: e.target.value })}
                    className="w-full rounded-xl border-[2.5px] border-black bg-white p-3 text-xs font-bold text-black shadow-[2px_2px_0px_#171717]"
                  >
                    <option value="manager">Bank Manager (ROI & Executive)</option>
                    <option value="admin">Platform Admin (FedOps Enclave)</option>
                    <option value="analyst">Fraud Analyst (Live Triage)</option>
                    <option value="secops">SecOps Auditor (Integrity)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                    Edge Schema Architecture
                  </label>
                  <select
                    value={signupForm.nodeType}
                    onChange={(e) => setSignupForm({ ...signupForm, nodeType: e.target.value })}
                    className="w-full rounded-xl border-[2.5px] border-black bg-white p-3 text-xs font-bold text-black shadow-[2px_2px_0px_#171717]"
                  >
                    <option value="sql">Relational SQL (Postgres / Oracle Edge)</option>
                    <option value="json">NoSQL Document (JSON / Mongo Edge)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                  Generate Node Security Passkey
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    placeholder="Create strong enclave passkey"
                    className="w-full rounded-xl border-[2.5px] border-black bg-white p-3 pl-10 text-xs font-bold text-black shadow-[2px_2px_0px_#171717]"
                  />
                  <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-black/50" />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="neo-button w-full bg-[#b9ed48] hover:bg-[#a6db36] text-black font-black text-sm py-3.5 flex items-center justify-center gap-2 shadow-[4px_4px_0px_#171717]"
                >
                  <UserPlus className="h-4 w-4" />
                  Enroll Node & Launch Live Console →
                </button>
              </div>

              <div className="pt-2 text-center">
                <p className="text-xs font-bold text-black/70">
                  Already enrolled?{" "}
                  <button
                    type="button"
                    onClick={() => setCurrentView("login")}
                    className="font-black text-[#625fe8] underline hover:text-black"
                  >
                    Sign In with Existing Credentials
                  </button>
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: FULL CONSOLE DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf8ef] text-[#171717]">
      {/* Top Navigation Bar in Neo-Brutalist Theme */}
      <header className="border-b-[3px] border-black bg-[#fbf8ef] px-4 md:px-8 py-3.5 sticky top-0 z-40">
        <div className="max-w-[1720px] mx-auto flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          {/* Brand Cluster */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border-[3px] border-black bg-[#8987f5] shadow-[2.5px_2.5px_0px_#171717]">
              <ShieldAlert className="h-6 w-6 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-xl text-[#171717] display-type">
                  NexusFL
                </span>
                <span className="neo-pill bg-[#fffaf0] py-0.5 px-2 text-[9px]">
                  v2.4-PROD
                </span>
                <span className="h-2.5 w-2.5 rounded-full border-2 border-black bg-[#b9ed48] animate-pulse"></span>
              </div>
              <p className="text-[11px] font-bold text-black/70">
                Decentralized Cross-Bank Federated Intelligence Matrix
              </p>
            </div>
          </div>

          {/* Role Navigation Strip (Segmented Buttons) */}
          <nav className="layout-strip flex-wrap" aria-label="Role Navigation">
            <button
              onClick={() => setActiveRole("analyst")}
              className={`layout-btn flex items-center gap-1.5 ${
                activeRole === "analyst" ? "is-active" : ""
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Analyst Triage</span>
            </button>

            <button
              onClick={() => setActiveRole("admin")}
              className={`layout-btn flex items-center gap-1.5 ${
                activeRole === "admin" ? "is-active" : ""
              }`}
            >
              <Network className="h-3.5 w-3.5" />
              <span>Federated Analytics</span>
            </button>

            <button
              onClick={() => setActiveRole("secops")}
              className={`layout-btn flex items-center gap-1.5 ${
                activeRole === "secops" ? "is-active" : ""
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>SecOps & Integrity</span>
            </button>

            <button
              onClick={() => setActiveRole("manager")}
              className={`layout-btn flex items-center gap-1.5 ${
                activeRole === "manager" ? "is-active" : ""
              }`}
            >
              <Scale className="h-3.5 w-3.5" />
              <span>Bank Manager</span>
            </button>
          </nav>

          {/* Live Metric Telemetry Cluster */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className={`metric-pill ${
                apiStatus.connected ? "bg-[#b9ed48]" : "bg-[#ffc94a]"
              }`}
              title="FastAPI Engine"
            >
              <span className="font-black text-black">
                FastAPI: {apiStatus.connected ? `Online (${apiStatus.latency}ms)` : "Standby (Sim)"}
              </span>
            </div>

            <div className="metric-pill bg-[#48b9f2]" title="Edge Nodes">
              <span className="font-black text-black">2 Nodes Active</span>
            </div>

            <div className="metric-pill bg-[#ffc94a]" title="Strict Threshold">
              <span className="font-black text-black">Cutoff: 0.150</span>
            </div>

            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`neo-button flex items-center gap-1.5 px-3 py-1 text-xs text-black ${
                isLiveStreaming ? "bg-[#f46455] text-white" : "bg-[#ffc94a]"
              }`}
              title="Toggle automatic stream ingestion"
            >
              {isLiveStreaming ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isLiveStreaming ? "Pause Stream" : "Live Stream"}</span>
            </button>

            {/* Authenticated User Session Profile */}
            <div className="flex items-center gap-2 rounded-xl border-[2.5px] border-black bg-[#fffaf0] p-1.5 px-3 shadow-[2px_2px_0px_#171717]">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-[#ffc94a] font-black text-xs">
                {currentUser?.name ? currentUser.name.charAt(0) : "U"}
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black">{currentUser?.name || "Enclave User"}</span>
                  <span className={`neo-pill py-0 px-1.5 text-[8px] font-black uppercase ${
                    currentUser?.role === "manager" ? "bg-[#ffc94a]" :
                    currentUser?.role === "admin" ? "bg-[#8987f5]" :
                    currentUser?.role === "secops" ? "bg-[#b9ed48]" : "bg-[#48b9f2]"
                  }`}>
                    {currentUser?.role === "manager" ? "Bank Manager" :
                     currentUser?.role === "admin" ? "FedOps Admin" :
                     currentUser?.role === "secops" ? "SecOps" : "Analyst"}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-black/60 block truncate max-w-[140px]">
                  {currentUser?.institution || "Node Alpha"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="neo-button flex items-center gap-1 bg-[#f46455] text-white px-2.5 py-1 text-[11px] font-extrabold ml-1 hover:brightness-110"
                title="Sign Out to Landing Matrix"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

            <button
              onClick={() => setCurrentView("welcome")}
              className="neo-button flex h-10 w-10 items-center justify-center bg-[#fffaf0] p-0"
              title="Return to Landing Page"
            >
              <Home className="h-4 w-4 text-black" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-[1720px] mx-auto w-full p-4 md:p-6 space-y-5">
        {/* Audit Notice Alert */}
        {auditNotice && (
          <div className="p-3.5 rounded-[14px] border-[3px] border-black bg-[#b9ed48] text-black text-xs flex items-center justify-between shadow-[3px_3px_0px_#171717] fade-in">
            <div className="flex items-center gap-2 font-black">
              <CheckCircle2 className="h-4 w-4 text-black shrink-0" />
              <span>{auditNotice}</span>
            </div>
            <span className="neo-pill bg-[#171717] text-white py-0.5 px-2">
              Logged to Audit Trail
            </span>
          </div>
        )}

        {/* ======================================================== */}
        {/* ROLE 1: FRAUD ANALYST TRIAGE                             */}
        {/* ======================================================== */}
        {activeRole === "analyst" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Rail (Controls + Anomaly Inspector) */}
            <aside className="lg:col-span-4 space-y-5">
              {/* Stream Control Panel (Cyan #48b9f2) */}
              <section className="outlined-panel bg-[#48b9f2] p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="neo-pill bg-[#fffaf0] text-black">
                      Edge Simulation
                    </span>
                    <h2 className="display-type text-2xl font-black mt-1">
                      Stream Controls
                    </h2>
                  </div>
                  <div className="h-10 w-10 flex items-center justify-center rounded-[10px] border-[3px] border-black bg-[#ffc94a] shadow-[2px_2px_0px_#171717]">
                    <Zap className="h-5 w-5 text-black" />
                  </div>
                </div>

                <p className="text-xs font-bold leading-relaxed mb-4 text-[#171717]">
                  Inject synthetic credit card edge tensors through Node Alpha (PostgreSQL) or Node Beta (MongoDB).
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  <button
                    onClick={() => executeInference("bank_1", true)}
                    className="neo-button bg-[#f46455] text-white flex items-center justify-center gap-2 text-xs"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Simulate Bank 1 High-Risk (Anomaly)
                  </button>

                  <button
                    onClick={() => executeInference("bank_2", false)}
                    className="neo-button bg-[#b9ed48] text-black flex items-center justify-center gap-2 text-xs"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Simulate Bank 2 Normal (Safe)
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t-[2.5px] border-black/30 flex items-center justify-between text-xs font-mono font-black">
                  <span>Stream Buffer: {transactions.length} items</span>
                  <span className="text-red-950">
                    Flagged: {transactions.filter((t) => t.is_fraud).length}
                  </span>
                </div>
              </section>

              {/* Edge Anomaly Inspector Panel (Lime #b9ed48) */}
              <section className="outlined-panel bg-[#b9ed48] p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="neo-pill bg-[#fffaf0] text-black">
                      CANONICAL-30 TENSOR
                    </span>
                    <h2 className="display-type text-2xl font-black mt-1">
                      PCA Inspector
                    </h2>
                  </div>
                  <div className="h-10 w-10 flex items-center justify-center rounded-[10px] border-[3px] border-black bg-[#ffc94a] shadow-[2px_2px_0px_#171717]">
                    <Sliders className="h-5 w-5 text-black" />
                  </div>
                </div>

                {selectedTx ? (
                  <div className="space-y-4">
                    {/* Selected TX Header Card */}
                    <div className="outlined-card bg-[#fffaf0] p-3.5">
                      <div className="text-[10px] font-black uppercase text-black/60">
                        Selected Transaction
                      </div>
                      <div className="font-mono text-base font-black text-black mt-0.5">
                        {selectedTx.id}
                      </div>
                      <div className="text-xs font-bold text-black/80 mt-1 flex items-center justify-between">
                        <span>{selectedTx.bank}</span>
                        <span className="font-mono">{selectedTx.time}</span>
                      </div>
                    </div>

                    {/* Latent PCA Contributor Badges */}
                    <div>
                      <div className="text-xs font-black uppercase tracking-wider mb-2">
                        Primary PCA Anomaly Contributors:
                      </div>
                      <div className="space-y-1.5 font-mono text-xs">
                        <div className="flex items-center justify-between p-2 rounded-[8px] border-2 border-black bg-[#fffaf0]">
                          <span className="font-bold">Feature V4 (Velocity):</span>
                          <span
                            className={`font-black ${
                              selectedTx.pcaHighlights?.v4 > 2.0
                                ? "text-red-600"
                                : "text-black"
                            }`}
                          >
                            {selectedTx.pcaHighlights?.v4?.toFixed(3) || "0.000"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-[8px] border-2 border-black bg-[#fffaf0]">
                          <span className="font-bold">Feature V12 (Behavioral):</span>
                          <span
                            className={`font-black ${
                              selectedTx.pcaHighlights?.v12 < -2.0
                                ? "text-red-600"
                                : "text-black"
                            }`}
                          >
                            {selectedTx.pcaHighlights?.v12?.toFixed(3) || "0.000"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-[8px] border-2 border-black bg-[#fffaf0]">
                          <span className="font-bold">Feature V14 (Pattern):</span>
                          <span
                            className={`font-black ${
                              selectedTx.pcaHighlights?.v14 < -2.0
                                ? "text-red-600"
                                : "text-black"
                            }`}
                          >
                            {selectedTx.pcaHighlights?.v14?.toFixed(3) || "0.000"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Threshold Comparison Progress Gauge */}
                    <div className="outlined-card bg-[#fffaf0] p-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold">Model Probability:</span>
                        <span className="font-mono font-black text-sm">
                          {selectedTx.probability.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold">Applied Cutoff:</span>
                        <span className="font-mono font-black text-red-600">0.150 (Strict)</span>
                      </div>
                      <div className="w-full bg-[#fbf8ef] border-2 border-black h-4 rounded-full relative overflow-hidden">
                        <div
                          className={`h-full ${
                            selectedTx.probability >= 0.15 ? "bg-[#f46455]" : "bg-[#b9ed48]"
                          }`}
                          style={{ width: `${Math.min(100, selectedTx.probability * 100)}%` }}
                        ></div>
                        <div
                          className="absolute top-0 bottom-0 w-1 bg-black z-10"
                          style={{ left: "15%" }}
                          title="0.15 Strict Cutoff"
                        ></div>
                      </div>
                      <div className="text-[10px] font-black text-black/70 mt-1 flex justify-between font-mono">
                        <span>0.00</span>
                        <span className="text-red-600 font-bold">Cutoff 0.15</span>
                        <span>1.00</span>
                      </div>
                    </div>

                    {/* Analyst Override Actions */}
                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => handleConfirmFraud(selectedTx)}
                        className="neo-button w-full bg-[#f46455] text-white flex items-center justify-center gap-2 text-xs"
                      >
                        <ShieldAlert className="h-4 w-4" />
                        Confirm Fraud // Freeze Account
                      </button>

                      <button
                        onClick={() => handleOverrideFalsePositive(selectedTx)}
                        className="neo-button w-full bg-[#fffaf0] text-black flex items-center justify-center gap-2 text-xs"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Override as False Positive
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center font-bold text-xs">
                    Select any transaction from the right stream to inspect PCA tensors.
                  </div>
                )}
              </section>
            </aside>

            {/* Right Canvas: Live Transaction Stream (Editorial Grid + Purple Header) */}
            <section className="lg:col-span-8 outlined-panel bg-[#8987f5] flex flex-col">
              {/* Canvas Header */}
              <div className="bg-[#fffaf0] border-b-[3px] border-black p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="neo-pill bg-[#48b9f2] text-black text-[9px]">
                      LIVE INGESTION MATRIX
                    </span>
                    <h2 className="display-type text-xl font-black">
                      Recent Edge Stream Triage
                    </h2>
                  </div>
                  <p className="text-xs font-bold text-black/70 mt-0.5">
                    Click any transaction to inspect PCA components or execute operational override.
                  </p>
                </div>

                <div className="metric-pill bg-[#ffc94a]">
                  <span>{transactions.length} items logged</span>
                </div>
              </div>

              {/* Transactions Table Container */}
              <div className="editorial-grid bg-[#fbf8ef] p-4 flex-1 overflow-x-auto min-h-[500px]">
                <div className="outlined-card bg-[#fffaf0] overflow-hidden">
                  <table className="custom-table text-left">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Edge Source</th>
                        <th className="text-right">Amount</th>
                        <th>Probability</th>
                        <th>Disposition</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-xs font-bold divide-y-2 divide-black/10">
                      {transactions.map((tx) => {
                        const isSelected = selectedTx?.id === tx.id;
                        return (
                          <tr
                            key={tx.id}
                            onClick={() => setSelectedTx(tx)}
                            className={`cursor-pointer transition ${
                              isSelected ? "selected" : ""
                            }`}
                          >
                            <td className="font-black text-black">{tx.id}</td>
                            <td className="font-normal font-sans text-black/80">
                              <span className="inline-flex items-center gap-1">
                                <Database className="h-3.5 w-3.5 text-black/60" />
                                {tx.bank.split(" ")[0]}
                              </span>
                            </td>
                            <td className="text-right font-black">
                              ${tx.amount.toFixed(2)}
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-[#fbf8ef] border border-black h-2 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      tx.probability >= 0.15 ? "bg-[#f46455]" : "bg-[#b9ed48]"
                                    }`}
                                    style={{ width: `${Math.min(100, tx.probability * 100)}%` }}
                                  ></div>
                                </div>
                                <span
                                  className={`font-black ${
                                    tx.probability >= 0.15 ? "text-red-700" : "text-black"
                                  }`}
                                >
                                  {tx.probability.toFixed(3)}
                                </span>
                              </div>
                            </td>
                            <td>
                              {tx.status === "CONFIRMED_FRAUD" ? (
                                <span className="neo-pill bg-[#f46455] text-white py-0.5 px-2 text-[9px]">
                                  FROZEN // FRAUD
                                </span>
                              ) : tx.status === "FALSE_POSITIVE" ? (
                                <span className="neo-pill bg-[#ffc94a] text-black py-0.5 px-2 text-[9px]">
                                  OVERRIDDEN
                                </span>
                              ) : tx.is_fraud ? (
                                <span className="neo-pill bg-[#f46455] text-white py-0.5 px-2 text-[9px]">
                                  ALERT (≥0.15)
                                </span>
                              ) : (
                                <span className="neo-pill bg-[#b9ed48] text-black py-0.5 px-2 text-[9px]">
                                  APPROVED
                                </span>
                              )}
                            </td>
                            <td className="text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTx(tx);
                                }}
                                className="font-black text-xs hover:underline flex items-center justify-end gap-1 ml-auto"
                              >
                                Details →
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* ROLE 2: FEDERATED ANALYTICS (ADMIN)                      */}
        {/* ======================================================== */}
        {activeRole === "admin" && (
          <div className="space-y-5">
            {/* Zero-Knowledge Privacy Banner */}
            <div className="outlined-panel bg-[#48b9f2] p-5 flex items-start gap-4">
              <div className="h-12 w-12 rounded-[14px] border-[3px] border-black bg-[#ffc94a] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#171717]">
                <Network className="h-6 w-6 text-black" />
              </div>
              <div>
                <span className="neo-pill bg-[#fffaf0] text-black text-[9px]">
                  FEDAVG PROTOCOL • ZERO-KNOWLEDGE
                </span>
                <h2 className="display-type text-2xl font-black mt-1">
                  Cross-Bank Federated Learning Enclave
                </h2>
                <p className="text-xs font-bold leading-relaxed text-black/90 mt-1 max-w-4xl">
                  Raw transactional datasets never leave Bank 1 (Relational SQL) or Bank 2 (NoSQL Document Enclave).
                  Only decentralized PyTorch weight tensors (&Delta;W &isin; &#8477;<sup>4,129</sup>) are aggregated across
                  communication rounds. Zero customer balance, account numbers, or PII are exposed.
                </p>
              </div>
            </div>

            {/* 4 Neo-Brutalist Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="outlined-card bg-[#b9ed48] p-4">
                <div className="text-[10px] font-black uppercase tracking-wider text-black/70">
                  Global Model PR-AUC
                </div>
                <div className="text-3xl font-black font-mono mt-1 text-black">
                  0.842
                </div>
                <div className="text-xs font-black text-black mt-1 flex items-center gap-1">
                  <ArrowUpRight className="h-3.5 w-3.5 text-black" />
                  +18.4% vs Siloed Models
                </div>
              </div>

              <div className="outlined-card bg-[#ffc94a] p-4">
                <div className="text-[10px] font-black uppercase tracking-wider text-black/70">
                  Weight Drift / Divergence
                </div>
                <div className="text-3xl font-black font-mono mt-1 text-black">
                  0.042
                </div>
                <div className="text-xs font-bold text-black/80 mt-1">
                  Euclidean Norm &Vert;&Delta;W₁ - &Delta;W₂&Vert;
                </div>
              </div>

              <div className="outlined-card bg-[#48b9f2] p-4">
                <div className="text-[10px] font-black uppercase tracking-wider text-black/70">
                  Privacy Budget (DP-SGD)
                </div>
                <div className="text-3xl font-black font-mono mt-1 text-black">
                  &epsilon; = 1.20
                </div>
                <div className="text-xs font-bold text-black/80 mt-1">
                  &delta; = 10⁻⁵ Strict Bound
                </div>
              </div>

              <div className="outlined-card bg-[#8987f5] p-4">
                <div className="text-[10px] font-black uppercase tracking-wider text-black/70">
                  Edge Quorum
                </div>
                <div className="text-3xl font-black font-mono mt-1 text-black">
                  2 / 2 Nodes
                </div>
                <div className="text-xs font-black text-black mt-1">
                  100% Round Consensus
                </div>
              </div>
            </div>

            {/* Convergence SVG Plot Container */}
            <div className="outlined-panel bg-[#fffaf0] p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b-[2.5px] border-black">
                <div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-black" />
                    <h3 className="display-type text-lg font-black">
                      Federated Convergence Across 10 Communication Rounds
                    </h3>
                  </div>
                  <p className="text-xs font-bold text-black/70 mt-0.5">
                    PR-AUC progression: Global FedAvg vs Edge Bank Isolated Baselines.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-black">
                  <span className="neo-pill bg-[#8987f5] text-black">Global FedAvg (0.842)</span>
                  <span className="neo-pill bg-[#48b9f2] text-black">Bank 1 Local (0.761)</span>
                  <span className="neo-pill bg-[#ffc94a] text-black">Bank 2 Local (0.724)</span>
                </div>
              </div>

              {/* Clean SVG Line Plot */}
              <div className="editorial-grid bg-[#fbf8ef] mt-4 p-4 rounded-[14px] border-[2.5px] border-black h-72 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0.5, 0.6, 0.7, 0.8, 0.9].map((val, idx) => {
                    const y = 220 - (val - 0.5) * 450;
                    return (
                      <g key={idx}>
                        <line x1="50" y1={y} x2="780" y2={y} stroke="#171717" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                        <text x="10" y={y + 4} fill="#171717" fontSize="11" fontWeight="bold" fontFamily="monospace">
                          {val.toFixed(2)}
                        </text>
                      </g>
                    );
                  })}

                  {/* X Axis Rounds */}
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => {
                    const x = 50 + (r - 1) * (730 / 9);
                    return (
                      <text key={r} x={x} y="235" textAnchor="middle" fill="#171717" fontSize="11" fontWeight="bold" fontFamily="monospace">
                        R{r}
                      </text>
                    );
                  })}

                  {/* Bank 2 Curve (Yellow) */}
                  <polyline
                    fill="none"
                    stroke="#ffc94a"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    points={FEDERATED_ROUNDS_DATA.map((d, i) => `${50 + i * (730 / 9)},${220 - (d.bank2PrAuc - 0.5) * 450}`).join(" ")}
                  />

                  {/* Bank 1 Curve (Cyan) */}
                  <polyline
                    fill="none"
                    stroke="#48b9f2"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    points={FEDERATED_ROUNDS_DATA.map((d, i) => `${50 + i * (730 / 9)},${220 - (d.bank1PrAuc - 0.5) * 450}`).join(" ")}
                  />

                  {/* Global FedAvg Curve (Deep Purple) */}
                  <polyline
                    fill="none"
                    stroke="#625fe8"
                    strokeWidth="5"
                    strokeLinecap="round"
                    points={FEDERATED_ROUNDS_DATA.map((d, i) => `${50 + i * (730 / 9)},${220 - (d.globalPrAuc - 0.5) * 450}`).join(" ")}
                  />

                  {/* Final highlighted dot */}
                  <circle cx="780" cy={220 - (0.842 - 0.5) * 450} r="6" fill="#625fe8" stroke="#171717" strokeWidth="2.5" />
                </svg>
              </div>
            </div>

            {/* Edge Bank Node Performance Comparison Table */}
            <div className="outlined-panel bg-[#fffaf0] overflow-hidden">
              <div className="p-4 border-b-[2.5px] border-black bg-[#ffc94a] flex items-center justify-between">
                <span className="display-type font-black text-sm text-black">
                  Institutional Edge Node Architecture Matrix
                </span>
                <span className="neo-pill bg-[#171717] text-white text-[9px]">
                  Zero Data Leakage
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="custom-table text-left">
                  <thead>
                    <tr>
                      <th>Node Designation</th>
                      <th>Adapter Architecture</th>
                      <th className="text-right">Edge Sample Size</th>
                      <th className="text-right">Local PR-AUC</th>
                      <th className="text-right">Global FedAvg</th>
                      <th className="text-right">Net Gain</th>
                      <th>Node Status</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-xs font-bold divide-y-2 divide-black/10">
                    <tr>
                      <td className="font-black text-black">Bank 1 (Node Alpha)</td>
                      <td className="font-sans text-black/80">Relational SQL Adapter (PostgreSQL)</td>
                      <td className="text-right">142,400 rows</td>
                      <td className="text-right">0.761</td>
                      <td className="text-right font-black text-[#625fe8]">0.839</td>
                      <td className="text-right font-black text-emerald-800">+10.2%</td>
                      <td>
                        <span className="neo-pill bg-[#b9ed48] text-black text-[9px]">
                          Active Sync
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="font-black text-black">Bank 2 (Node Beta)</td>
                      <td className="font-sans text-black/80">NoSQL JSON Document Adapter (MongoDB)</td>
                      <td className="text-right">89,200 docs</td>
                      <td className="text-right">0.724</td>
                      <td className="text-right font-black text-[#625fe8]">0.845</td>
                      <td className="text-right font-black text-emerald-800">+16.7%</td>
                      <td>
                        <span className="neo-pill bg-[#b9ed48] text-black text-[9px]">
                          Active Sync
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ROLE 3: SECURITY & INTEGRITY (SECOPS)                     */}
        {/* ======================================================== */}
        {activeRole === "secops" && (
          <div className="space-y-5">
            {/* Header Control Panel */}
            <div className="outlined-panel bg-[#8987f5] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="neo-pill bg-[#fffaf0] text-black text-[9px]">
                  ZERO-TRUST DEFENSE
                </span>
                <h2 className="display-type text-2xl font-black mt-1">
                  Node Integrity & Byzantine Poisoning Defense
                </h2>
                <p className="text-xs font-bold text-black/80 mt-1">
                  Cryptographic gradient clipping, SHA-256 state checkpointing, and edge revocation controls.
                </p>
              </div>

              <button
                onClick={() => setFreezeEdgeSync(!freezeEdgeSync)}
                className={`neo-button flex items-center gap-2 text-xs font-black ${
                  freezeEdgeSync ? "bg-[#f46455] text-white" : "bg-[#fffaf0] text-black"
                }`}
              >
                <AlertTriangle className="h-4 w-4" />
                {freezeEdgeSync ? "Edge Synchronization Frozen" : "Freeze Edge Sync"}
              </button>
            </div>

            {/* SecOps 3 Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* mTLS Status Card */}
              <div className="outlined-panel bg-[#fffaf0] p-4 space-y-3">
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                  <span className="display-type text-sm font-black flex items-center gap-1.5">
                    <Key className="h-4 w-4 text-black" />
                    Mutual TLS 1.3
                  </span>
                  <span className="neo-pill bg-[#b9ed48] text-black text-[9px]">HEALTHY</span>
                </div>
                <div className="space-y-2 text-xs font-mono font-bold">
                  <div className="flex justify-between p-2 rounded-[8px] border-2 border-black bg-[#fbf8ef]">
                    <span className="text-black/70">Bank 1 Cert:</span>
                    <span>SHA-256 Valid (2027)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-[8px] border-2 border-black bg-[#fbf8ef]">
                    <span className="text-black/70">Bank 2 Cert:</span>
                    <span>SHA-256 Valid (2027)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-[8px] border-2 border-black bg-[#fbf8ef]">
                    <span className="text-black/70">Cipher:</span>
                    <span>TLS_AES_256_GCM</span>
                  </div>
                </div>
              </div>

              {/* Byzantine Defense Card */}
              <div className="outlined-panel bg-[#fffaf0] p-4 space-y-3">
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                  <span className="display-type text-sm font-black flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-black" />
                    Byzantine Poisoning
                  </span>
                  <span className="neo-pill bg-[#b9ed48] text-black text-[9px]">PASSED</span>
                </div>
                <div className="space-y-2 text-xs font-mono font-bold">
                  <div className="flex justify-between p-2 rounded-[8px] border-2 border-black bg-[#fbf8ef]">
                    <span className="text-black/70">Gradient Clipping:</span>
                    <span>Norm &le; 2.50 (Enforced)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-[8px] border-2 border-black bg-[#fbf8ef]">
                    <span className="text-black/70">Poisoning Score:</span>
                    <span className="text-emerald-800">0.018 (Safe &lt;0.35)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-[8px] border-2 border-black bg-[#fbf8ef]">
                    <span className="text-black/70">Sybil Detection:</span>
                    <span>Multi-Factor Active</span>
                  </div>
                </div>
              </div>

              {/* Edge Token Revocation Card */}
              <div className="outlined-panel bg-[#fffaf0] p-4 space-y-3">
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                  <span className="display-type text-sm font-black flex items-center gap-1.5">
                    <Server className="h-4 w-4 text-black" />
                    Edge Revocation
                  </span>
                  <span className="neo-pill bg-[#ffc94a] text-black text-[9px]">CONTROL</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-[8px] border-2 border-black bg-[#fbf8ef]">
                    <span className="font-mono font-bold">Bank 1 Node:</span>
                    <button
                      onClick={() =>
                        setNodeTokens((prev) => ({
                          ...prev,
                          bank1: prev.bank1 === "REVOKED_YES" ? "REVOKED_NO" : "REVOKED_YES",
                        }))
                      }
                      className={`neo-button min-h-[30px] py-1 px-2 text-[10px] ${
                        nodeTokens.bank1 === "REVOKED_YES"
                          ? "bg-[#f46455] text-white"
                          : "bg-[#fffaf0] text-black"
                      }`}
                    >
                      {nodeTokens.bank1 === "REVOKED_YES" ? "REVOKED" : "REVOKE TOKEN"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-[8px] border-2 border-black bg-[#fbf8ef]">
                    <span className="font-mono font-bold">Bank 2 Node:</span>
                    <button
                      onClick={() =>
                        setNodeTokens((prev) => ({
                          ...prev,
                          bank2: prev.bank2 === "REVOKED_YES" ? "REVOKED_NO" : "REVOKED_YES",
                        }))
                      }
                      className={`neo-button min-h-[30px] py-1 px-2 text-[10px] ${
                        nodeTokens.bank2 === "REVOKED_YES"
                          ? "bg-[#f46455] text-white"
                          : "bg-[#fffaf0] text-black"
                      }`}
                    >
                      {nodeTokens.bank2 === "REVOKED_YES" ? "REVOKED" : "REVOKE TOKEN"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptographic Ledger Table */}
            <div className="outlined-panel bg-[#fffaf0] overflow-hidden">
              <div className="p-4 border-b-[2.5px] border-black bg-[#b9ed48] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-black" />
                  <span className="display-type font-black text-sm text-black">
                    Immutable PyTorch Checkpoint Audit Ledger (global_model.pt)
                  </span>
                </div>
                <span className="neo-pill bg-[#171717] text-white text-[9px]">
                  SHA-256 Digest Verification
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="custom-table text-left">
                  <thead>
                    <tr>
                      <th>Round</th>
                      <th>Timestamp</th>
                      <th>Aggregation Hash (SHA-256)</th>
                      <th>Algorithm</th>
                      <th className="text-right">Integrity Status</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-xs font-bold divide-y-2 divide-black/10">
                    {CRYPTO_LEDGER.map((entry) => (
                      <tr key={entry.round}>
                        <td className="font-black text-black">Round {entry.round}</td>
                        <td className="text-black/70">{entry.timestamp}</td>
                        <td className="text-black">{entry.hash}</td>
                        <td className="text-black/70">{entry.algo}</td>
                        <td className="text-right">
                          <span className="neo-pill bg-[#b9ed48] text-black text-[9px]">
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ROLE 4: BANK MANAGER (EXECUTIVE)                          */}
        {/* ======================================================== */}
        {activeRole === "manager" && (
          <div className="space-y-5">
            {/* Executive ROI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="outlined-card bg-[#b9ed48] p-4">
                <div className="text-[10px] font-black uppercase tracking-wider text-black/70">
                  Prevented Fraud Losses
                </div>
                <div className="text-3xl font-black font-mono mt-1 text-black">
                  $3,842,500.00
                </div>
                <div className="text-xs font-bold text-black/80 mt-1">
                  YTD Cross-Bank Interception
                </div>
              </div>

              <div className="outlined-card bg-[#ffc94a] p-4">
                <div className="text-[10px] font-black uppercase tracking-wider text-black/70">
                  Analyst Review Overhead
                </div>
                <div className="text-3xl font-black font-mono mt-1 text-black">
                  $28,450.00
                </div>
                <div className="text-xs font-bold text-black/80 mt-1">
                  0.74% Operational Friction Cost
                </div>
              </div>

              <div className="outlined-card bg-[#48b9f2] p-4">
                <div className="text-[10px] font-black uppercase tracking-wider text-black/70">
                  Net Capital Protected
                </div>
                <div className="text-3xl font-black font-mono mt-1 text-black">
                  $3,814,050.00
                </div>
                <div className="text-xs font-black text-black mt-1">
                  134.0x Net Operating ROI
                </div>
              </div>

              <div className="outlined-card bg-[#8987f5] p-4">
                <div className="text-[10px] font-black uppercase tracking-wider text-black/70">
                  SLA Compliance Rate
                </div>
                <div className="text-3xl font-black font-mono mt-1 text-black">
                  99.998%
                </div>
                <div className="text-xs font-bold text-black/80 mt-1">
                  P95 Inference &lt; 15ms target
                </div>
              </div>
            </div>

            {/* Threshold Trade-Off Analysis Matrix */}
            <div className="outlined-panel bg-[#fffaf0]">
              <div className="p-4 border-b-[2.5px] border-black bg-[#ffc94a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="display-type text-lg font-black text-black">
                    Decision Threshold Trade-Off Matrix (0.15 Rationale)
                  </h3>
                  <p className="text-xs font-bold text-black/80 mt-0.5">
                    Why the strict 0.15 cutoff yields maximum net capital protection vs naive 0.50 default.
                  </p>
                </div>
                <span className="neo-pill bg-[#171717] text-white text-[9px]">
                  Baseline Cutoff: 0.15
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="custom-table text-left">
                  <thead>
                    <tr>
                      <th>Threshold</th>
                      <th>Recall (Caught)</th>
                      <th>Precision</th>
                      <th className="text-right">Prevented Loss</th>
                      <th className="text-right">Friction Overhead</th>
                      <th className="text-right">Net Business Value</th>
                      <th>Operational Viability</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-xs font-bold divide-y-2 divide-black/10">
                    <tr>
                      <td>0.05</td>
                      <td className="text-emerald-800">96.2%</td>
                      <td className="text-red-700">38.0%</td>
                      <td className="text-right">$4,120,000</td>
                      <td className="text-right text-red-700">$640,000</td>
                      <td className="text-right">$3,480,000</td>
                      <td>
                        <span className="neo-pill bg-[#ffc94a] text-black text-[9px]">
                          Queue Overwhelmed
                        </span>
                      </td>
                    </tr>

                    <tr className="bg-[#b9ed48]/30 font-black">
                      <td className="text-black flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-black"></span>
                        0.15 (OPTIMAL)
                      </td>
                      <td className="text-emerald-800">86.4%</td>
                      <td className="text-emerald-800">72.1%</td>
                      <td className="text-right">$3,842,500</td>
                      <td className="text-right">$28,450</td>
                      <td className="text-right text-[#625fe8] font-black">$3,814,050</td>
                      <td>
                        <span className="neo-pill bg-[#b9ed48] text-black text-[9px]">
                          Maximum Net ROI
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>0.30</td>
                      <td className="text-amber-800">68.0%</td>
                      <td>84.5%</td>
                      <td className="text-right">$2,980,000</td>
                      <td className="text-right">$9,200</td>
                      <td className="text-right">$2,970,800</td>
                      <td>
                        <span className="neo-pill bg-[#ffc94a] text-black text-[9px]">
                          Fraud Leakage
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>0.50 (Default)</td>
                      <td className="text-red-700">41.2%</td>
                      <td className="text-emerald-800">91.0%</td>
                      <td className="text-right">$1,740,000</td>
                      <td className="text-right">$2,100</td>
                      <td className="text-right text-red-700">$1,737,900</td>
                      <td>
                        <span className="neo-pill bg-[#f46455] text-white text-[9px]">
                          -$2.07M Lost to Fraud
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Compliance & Governance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="outlined-card bg-[#fffaf0] p-4">
                <div className="flex items-center gap-2 text-xs font-black">
                  <CheckCircle2 className="h-4 w-4 text-emerald-800" />
                  GDPR Article 25 (Privacy by Design)
                </div>
                <p className="text-xs font-bold text-black/70 mt-2 leading-relaxed">
                  Zero raw PII leaves bank perimeters. Only differential privacy bounded parameter updates cross boundaries.
                </p>
              </div>

              <div className="outlined-card bg-[#fffaf0] p-4">
                <div className="flex items-center gap-2 text-xs font-black">
                  <CheckCircle2 className="h-4 w-4 text-emerald-800" />
                  RBI Master Directions on Cyber Security
                </div>
                <p className="text-xs font-bold text-black/70 mt-2 leading-relaxed">
                  Data localization maintained 100% within sovereign bank on-premise and local cloud enclaves.
                </p>
              </div>

              <div className="outlined-card bg-[#fffaf0] p-4">
                <div className="flex items-center gap-2 text-xs font-black">
                  <CheckCircle2 className="h-4 w-4 text-emerald-800" />
                  Basel III Operational Resilience
                </div>
                <p className="text-xs font-bold text-black/70 mt-2 leading-relaxed">
                  Demonstrable operational resilience and quantifiable loss reduction backed by cryptographic digest audits.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Neo-Brutalist Footer */}
      <footer className="border-t-[3px] border-black bg-[#fffaf0] py-4 px-6 text-xs mt-10">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono font-bold">
          <div>
            NexusFL Cross-Institutional Framework &copy; 2026. Zero-Trust Security Protocol.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>Aggregator: Flower 1.7.0</span>
            <span>PyTorch 2.14.1 (CPU Inference)</span>
            <span className="neo-pill bg-[#b9ed48] text-black text-[9px]">
              ● SECURE FEDERATION ACTIVE
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

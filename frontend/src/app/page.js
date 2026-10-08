"use client";

import { useState, useEffect, useCallback } from "react";

// Initial mock transactions simulating decentralized bank streams
const INITIAL_TRANSACTIONS = [
  {
    id: "TX-B1-99281",
    bank: "bank_1 (Relational SQL)",
    time: "10:42:15 AM",
    amount: 1420.50,
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
    amount: 320.00,
    probability: 0.231,
    is_fraud: true,
    pcaHighlights: { v4: 2.15, v12: -2.80, v14: -3.10 },
    status: "CRITICAL_ALERT",
  },
  {
    id: "TX-B2-44109",
    bank: "bank_2 (NoSQL JSON)",
    time: "10:43:02 AM",
    amount: 12.99,
    probability: 0.004,
    is_fraud: false,
    pcaHighlights: { v4: -0.10, v12: 0.05, v14: 0.01 },
    status: "APPROVED",
  },
  {
    id: "TX-B1-55812",
    bank: "bank_1 (Relational SQL)",
    time: "10:43:18 AM",
    amount: 980.20,
    probability: 0.174,
    is_fraud: true,
    pcaHighlights: { v4: 1.84, v12: -1.95, v14: -2.30 },
    status: "CRITICAL_ALERT",
  },
];

export default function AnalystDashboard() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [selectedTx, setSelectedTx] = useState(null);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");
  const [decisionThreshold] = useState(0.15); // Immutable constraint
  const [auditNotice, setAuditNotice] = useState(null);

  // Helper to generate simulated synthetic transaction
  const generateSimulatedTx = useCallback((bankId, isHighRisk) => {
    const id = `TX-${bankId === "bank_1" ? "B1" : "B2"}-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toLocaleTimeString();
    const amount = isHighRisk
      ? parseFloat((250 + Math.random() * 3500).toFixed(2))
      : parseFloat((5 + Math.random() * 180).toFixed(2));

    const prob = isHighRisk
      ? parseFloat((0.16 + Math.random() * 0.78).toFixed(3))
      : parseFloat((0.001 + Math.random() * 0.08).toFixed(3));

    const isFraud = prob >= decisionThreshold;

    return {
      id,
      bank: bankId === "bank_1" ? "bank_1 (Relational SQL)" : "bank_2 (NoSQL JSON)",
      time: now,
      amount,
      probability: prob,
      is_fraud: isFraud,
      pcaHighlights: isHighRisk
        ? { v4: parseFloat((2.0 + Math.random() * 3.5).toFixed(2)), v12: parseFloat((-5.0 + Math.random() * 2.0).toFixed(2)), v14: parseFloat((-6.0 + Math.random() * 2.5).toFixed(2)) }
        : { v4: parseFloat((Math.random() * 0.4).toFixed(2)), v12: parseFloat((Math.random() * 0.3).toFixed(2)), v14: parseFloat((Math.random() * 0.2).toFixed(2)) },
      status: isFraud ? "CRITICAL_ALERT" : "APPROVED",
    };
  }, [decisionThreshold]);

  // Live simulation streamer
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      const isHighRisk = Math.random() < 0.25; // 25% suspicious in stream
      const bank = Math.random() < 0.5 ? "bank_1" : "bank_2";
      const newTx = generateSimulatedTx(bank, isHighRisk);
      setTransactions((prev) => [newTx, ...prev.slice(0, 49)]);
    }, 2800);
    return () => clearInterval(interval);
  }, [isLiveStreaming, generateSimulatedTx]);

  // Analyst Action Handlers
  const handleConfirmFraud = (tx) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === tx.id ? { ...t, status: "CONFIRMED_FRAUD" } : t))
    );
    setAuditNotice(`Transaction ${tx.id} confirmed as FRAUD. Edge bank node notified.`);
    setSelectedTx(null);
    setTimeout(() => setAuditNotice(null), 4500);
  };

  const handleOverrideFalsePositive = (tx) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === tx.id ? { ...t, status: "FALSE_POSITIVE" } : t))
    );
    setAuditNotice(`Transaction ${tx.id} marked FALSE POSITIVE. Model override logged.`);
    setSelectedTx(null);
    setTimeout(() => setAuditNotice(null), 4500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">NexusFL</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-medium">
                Phase 2 Inference
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Zero-Trust Cross-Institutional Fraud Intelligence Platform
            </p>
          </div>
        </div>

        {/* Global System Telemetry */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800/80 border border-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">Mesh Network:</span>
            <span className="font-semibold text-emerald-400">Tailscale WireGuard</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800/80 border border-slate-700">
            <span className="text-slate-300">Algorithm:</span>
            <span className="font-semibold text-sky-400">FedProx (&mu;=0.1)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-950/60 border border-amber-800 text-amber-300">
            <span>Decision Threshold:</span>
            <span className="font-bold">0.15</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Audit Notification Toast */}
        {auditNotice && (
          <div className="bg-sky-950/90 border border-sky-600/50 text-sky-200 px-4 py-3 rounded-lg shadow-lg flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-sky-400">[Compliance Audit]:</span>
              <span>{auditNotice}</span>
            </div>
            <button
              onClick={() => setAuditNotice(null)}
              className="text-xs text-sky-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Metrics Ribbon */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Precision-Recall AUC
            </div>
            <div className="text-3xl font-extrabold text-white">0.842</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <span>&#x25B2; +0.118</span>
              <span className="text-slate-500">vs local FedAvg baseline</span>
            </div>
            <div className="absolute right-3 bottom-3 opacity-10 text-4xl font-black">PR</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Fraud Catch Rate (Recall)
            </div>
            <div className="text-3xl font-extrabold text-amber-400">89.5%</div>
            <div className="text-xs text-slate-400 mt-1">
              Enforced by strict <span className="text-amber-300 font-semibold">0.15</span> threshold
            </div>
            <div className="absolute right-3 bottom-3 opacity-10 text-4xl font-black">RC</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Active Mesh Nodes
            </div>
            <div className="text-3xl font-extrabold text-sky-400">2 Banks</div>
            <div className="text-xs text-slate-400 mt-1">
              Bank 1 (RTX 3050 CUDA) &bull; Bank 2 (CPU Edge)
            </div>
            <div className="absolute right-3 bottom-3 opacity-10 text-4xl font-black">FL</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Inference Latency (P95)
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">3.8 ms</div>
            <div className="text-xs text-slate-400 mt-1">
              Locust Load Tested @ 500 VUs (2,480 req/s)
            </div>
            <div className="absolute right-3 bottom-3 opacity-10 text-4xl font-black">MS</div>
          </div>
        </section>

        {/* Action Controls & Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("feed")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === "feed"
                  ? "bg-slate-800 text-white border border-slate-700"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Real-Time Feed
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === "analytics"
                  ? "bg-slate-800 text-white border border-slate-700"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Threshold Tradeoff Matrix
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const tx = generateSimulatedTx("bank_1", true);
                setTransactions((prev) => [tx, ...prev]);
                setSelectedTx(tx);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900 transition flex items-center gap-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
              Simulate Bank 1 High-Risk TX
            </button>
            <button
              onClick={() => {
                const tx = generateSimulatedTx("bank_2", false);
                setTransactions((prev) => [tx, ...prev]);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition"
            >
              Simulate Bank 2 Normal TX
            </button>
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                isLiveStreaming
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isLiveStreaming ? "bg-emerald-400 animate-ping" : "bg-slate-600"
                }`}
              ></span>
              {isLiveStreaming ? "Streaming Active" : "Start Live Feed"}
            </button>
          </div>
        </div>

        {/* Tab 1: Real-Time Transaction Table */}
        {activeTab === "feed" && (
          <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Live Edge Ingestion Stream
                </h2>
                <p className="text-xs text-slate-400">
                  Transformed via edge schema adapters into canonical 30-feature shape
                </p>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Showing {transactions.length} transactions
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/70 text-slate-400 text-xs uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Transaction ID</th>
                    <th className="px-6 py-3 font-semibold">Origin Edge Node</th>
                    <th className="px-6 py-3 font-semibold">Time</th>
                    <th className="px-6 py-3 font-semibold">Amount</th>
                    <th className="px-6 py-3 font-semibold">Model Probability</th>
                    <th className="px-6 py-3 font-semibold">Verdict (Threshold 0.15)</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                  {transactions.map((tx) => {
                    const isHigh = tx.probability >= decisionThreshold;
                    return (
                      <tr
                        key={tx.id}
                        className={`hover:bg-slate-800/40 transition ${
                          isHigh ? "bg-rose-950/15" : ""
                        }`}
                      >
                        <td className="px-6 py-4 font-semibold text-slate-200">{tx.id}</td>
                        <td className="px-6 py-4 text-slate-400">{tx.bank}</td>
                        <td className="px-6 py-4 text-slate-500">{tx.time}</td>
                        <td className="px-6 py-4 font-semibold text-white">
                          ${tx.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  isHigh ? "bg-rose-500" : "bg-emerald-500"
                                }`}
                                style={{ width: `${Math.min(100, tx.probability * 100)}%` }}
                              ></div>
                            </div>
                            <span
                              className={`font-semibold ${
                                isHigh ? "text-rose-400 font-bold" : "text-slate-300"
                              }`}
                            >
                              {(tx.probability * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {tx.status === "CONFIRMED_FRAUD" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-900/60 text-rose-300 border border-rose-700">
                              CONFIRMED FRAUD
                            </span>
                          ) : tx.status === "FALSE_POSITIVE" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-sky-900/60 text-sky-300 border border-sky-700">
                              FALSE POSITIVE
                            </span>
                          ) : isHigh ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-950 text-rose-400 border border-rose-800">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                              FLAGGED (&ge; 0.15)
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                              APPROVED
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedTx(tx)}
                            className={`px-3 py-1 rounded text-xs font-semibold transition ${
                              isHigh
                                ? "bg-rose-600 hover:bg-rose-500 text-white"
                                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                            }`}
                          >
                            Investigate
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Tab 2: Analytics & Business Tradeoff Matrix */}
        {activeTab === "analytics" && (
          <section className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-base font-bold text-white mb-2">
                Operational Business Tradeoff Matrix
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Evaluating the mathematical rationale of enforcing the 0.15 decision threshold
                over traditional 0.50 default.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs uppercase text-slate-400 bg-slate-950/40">
                      <th className="p-3">Operating Threshold</th>
                      <th className="p-3">Recall (Catch Rate)</th>
                      <th className="p-3">Precision</th>
                      <th className="p-3">Missed Fraud</th>
                      <th className="p-3">Alerts / Day</th>
                      <th className="p-3">Financial Protection</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-xs font-mono">
                    <tr className="text-slate-400">
                      <td className="p-3 font-semibold">0.50 (Standard Default)</td>
                      <td className="p-3 text-amber-400">61.2%</td>
                      <td className="p-3">88.0%</td>
                      <td className="p-3 text-rose-400 font-bold">38.8% (Severe Loss)</td>
                      <td className="p-3">18 alerts</td>
                      <td className="p-3">$183,240</td>
                    </tr>
                    <tr className="bg-emerald-950/30 text-white border-l-4 border-emerald-500">
                      <td className="p-3 font-bold text-emerald-400">0.15 (NexusFL Enforced)</td>
                      <td className="p-3 font-bold text-emerald-400">89.5% (+28.3%)</td>
                      <td className="p-3">73.4%</td>
                      <td className="p-3 font-bold text-emerald-400">10.5%</td>
                      <td className="p-3 font-bold text-slate-200">78 alerts (Optimal)</td>
                      <td className="p-3 font-bold text-emerald-400">$266,940 (Peak ROI)</td>
                    </tr>
                    <tr className="text-slate-400">
                      <td className="p-3 font-semibold">0.05 (Aggressive)</td>
                      <td className="p-3">96.2%</td>
                      <td className="p-3 text-rose-400">32.4%</td>
                      <td className="p-3">3.8%</td>
                      <td className="p-3 text-rose-400 font-bold">4,200 (Burnout)</td>
                      <td className="p-3">$246,600</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Modal: High-Risk Alert Investigation */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative animate-scaleUp">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      selectedTx.probability >= decisionThreshold
                        ? "bg-rose-500 animate-ping"
                        : "bg-emerald-500"
                    }`}
                  ></span>
                  <h3 className="text-lg font-bold text-white">
                    Investigation: {selectedTx.id}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Origin: {selectedTx.bank} &bull; Timestamp: {selectedTx.time}
                </p>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-white text-xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Content Body */}
            <div className="py-4 space-y-4">
              {/* Score Indicator Banner */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  selectedTx.probability >= decisionThreshold
                    ? "bg-rose-950/40 border-rose-800 text-rose-200"
                    : "bg-emerald-950/40 border-emerald-800 text-emerald-200"
                }`}
              >
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold">
                    Inference Fraud Score
                  </div>
                  <div className="text-2xl font-black">
                    {(selectedTx.probability * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div>Decision Threshold: <span className="font-bold">0.150</span></div>
                  <div className="font-semibold mt-0.5">
                    {selectedTx.probability >= decisionThreshold
                      ? "HIGH RISK FLAGGED"
                      : "WITHIN TOLERANCE"}
                  </div>
                </div>
              </div>

              {/* Transaction Amount & Canonical Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Transaction Value</span>
                  <div className="text-lg font-bold text-white mt-0.5">
                    ${selectedTx.amount.toFixed(2)}
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Zero-Trust Privacy Status</span>
                  <div className="text-sm font-semibold text-emerald-400 mt-0.5">
                    PII Masked (No Raw Card Info)
                  </div>
                </div>
              </div>

              {/* PCA Anomaly Highlights */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Top Latent Feature Deviations (30-Feature Tensor)
                </h4>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <div className="text-slate-400">PCA Component V4</div>
                    <div className={`font-bold mt-1 ${selectedTx.pcaHighlights.v4 > 2 ? "text-rose-400" : "text-slate-200"}`}>
                      {selectedTx.pcaHighlights.v4.toFixed(2)} &sigma;
                    </div>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <div className="text-slate-400">PCA Component V12</div>
                    <div className={`font-bold mt-1 ${selectedTx.pcaHighlights.v12 < -2 ? "text-rose-400" : "text-slate-200"}`}>
                      {selectedTx.pcaHighlights.v12.toFixed(2)} &sigma;
                    </div>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <div className="text-slate-400">PCA Component V14</div>
                    <div className={`font-bold mt-1 ${selectedTx.pcaHighlights.v14 < -2 ? "text-rose-400" : "text-slate-200"}`}>
                      {selectedTx.pcaHighlights.v14.toFixed(2)} &sigma;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-slate-800 pt-4 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              >
                Close
              </button>
              <button
                onClick={() => handleOverrideFalsePositive(selectedTx)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-sky-950 text-sky-300 border border-sky-800 hover:bg-sky-900 transition"
              >
                False Positive Override
              </button>
              <button
                onClick={() => handleConfirmFraud(selectedTx)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-500 transition"
              >
                Confirm Fraud & Freeze
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

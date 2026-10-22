"use client";

import React, { useState } from "react";
import {
  Zap,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Database,
  Search,
  Filter,
  ShieldAlert,
  ArrowRight,
  Clock,
  MapPin,
  CreditCard,
} from "lucide-react";
import { GlassCard, GlassCardHeader } from "../ui/GlassCard";
import { GlassButton } from "../ui/GlassButton";
import { StatBadge } from "../ui/StatBadge";
import { CreditCardGraphic } from "../ui/CreditCardGraphic";
import { useApp } from "../../context/AppContext";

export function AnalystView() {
  const {
    transactions,
    selectedTx,
    setSelectedTx,
    executeInference,
    handleConfirmFraud,
    handleOverrideFalsePositive,
  } = useApp();

  const [filterMode, setFilterMode] = useState("all"); // "all" | "alerts" | "approved"
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter((tx) => {
    if (filterMode === "alerts" && !tx.is_fraud) return false;
    if (filterMode === "approved" && tx.is_fraud) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tx.id.toLowerCase().includes(q) ||
        tx.cardNumber?.toLowerCase().includes(q) ||
        tx.merchant?.toLowerCase().includes(q) ||
        tx.cardHolder?.toLowerCase().includes(q) ||
        tx.bank.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalFlagged = transactions.filter((t) => t.is_fraud).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* ======================================================== */}
      {/* Left Column: Stream Controls & PCA Tensor Inspector     */}
      {/* ======================================================== */}
      <aside className="lg:col-span-4 space-y-6">
        {/* Stream Simulator Controls */}
        <GlassCard variant="accent" className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                Edge Ingestion Generator
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Stream Controls
              </h2>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-lime-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]">
              <Zap className="h-5 w-5" />
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Inject synthetic edge tensors from Bank 1 (PostgreSQL Relational) or Bank 2 (MongoDB NoSQL Enclave).
          </p>

          <div className="space-y-2.5">
            <GlassButton
              id="btn-sim-high-risk"
              variant="danger"
              className="w-full text-xs justify-center"
              onClick={() => executeInference("bank_1", true)}
              icon={AlertTriangle}
            >
              Simulate Bank 1 High-Risk Anomaly
            </GlassButton>

            <GlassButton
              id="btn-sim-normal"
              variant="secondary"
              className="w-full text-xs justify-center hover:border-emerald-500/40"
              onClick={() => executeInference("bank_2", false)}
              icon={CheckCircle2}
            >
              Simulate Bank 2 Normal Transaction
            </GlassButton>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Stream Buffer: {transactions.length}</span>
            <span className="text-red-400 font-bold">Alerts: {totalFlagged}</span>
          </div>
        </GlassCard>

        {/* Selected Transaction PCA Inspector */}
        <GlassCard variant="elevated" className="p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-lime-400 px-2 py-0.5 rounded-full bg-lime-500/10 border border-lime-500/30">
                Canonical 30-Tensor
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                PCA Anomaly Triage
              </h2>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sliders className="h-5 w-5" />
            </div>
          </div>

          {selectedTx ? (
            <div className="space-y-4">
              {/* Selected TX Card Header */}
              <div className="p-3.5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-slate-400">
                    Inspecting Payload
                  </span>
                  <StatBadge status={selectedTx.status} />
                </div>
                <div className="font-mono text-base font-extrabold text-white mt-1">
                  {selectedTx.id}
                </div>
                <div className="text-xs text-slate-300 mt-1 flex items-center justify-between">
                  <span>{selectedTx.merchant || selectedTx.bank}</span>
                  <span className="font-bold text-emerald-400">
                    ${selectedTx.amount?.toFixed(2)}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-emerald-400" />
                  <span>{selectedTx.location || "Edge POS Terminal"}</span>
                </div>
              </div>

              {/* Threshold Comparison Gauge */}
              <div className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Model Probability:</span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      selectedTx.probability >= 0.15 ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {selectedTx.probability.toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">Strict SLA Cutoff:</span>
                  <span className="font-mono font-bold text-emerald-400">0.150 Mandate</span>
                </div>

                {/* Progress bar with 0.15 marker */}
                <div className="w-full bg-slate-900 border border-white/10 h-3 rounded-full relative overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      selectedTx.probability >= 0.15
                        ? "bg-gradient-to-r from-red-500 to-rose-400"
                        : "bg-gradient-to-r from-emerald-500 to-lime-400"
                    }`}
                    style={{ width: `${Math.min(100, selectedTx.probability * 100)}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white z-10 shadow-[0_0_6px_#fff]"
                    style={{ left: "15%" }}
                    title="0.15 Strict Cutoff Mark"
                  />
                </div>
                <div className="text-[9px] font-mono text-slate-500 mt-1 flex justify-between">
                  <span>0.00</span>
                  <span className="text-emerald-400 font-bold">Cutoff 0.15</span>
                  <span>1.00</span>
                </div>
              </div>

              {/* Latent PCA Feature Highlights */}
              <div>
                <div className="text-[11px] font-mono uppercase text-slate-400 mb-2">
                  Primary PCA Latent Contributors:
                </div>
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl border border-white/5 bg-white/[0.02]">
                    <span className="text-slate-300">V4 (Velocity):</span>
                    <span
                      className={`font-bold ${
                        selectedTx.pcaHighlights?.v4 > 2.0 ? "text-red-400" : "text-slate-200"
                      }`}
                    >
                      {selectedTx.pcaHighlights?.v4?.toFixed(3) || "0.000"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl border border-white/5 bg-white/[0.02]">
                    <span className="text-slate-300">V12 (Behavioral):</span>
                    <span
                      className={`font-bold ${
                        selectedTx.pcaHighlights?.v12 < -2.0 ? "text-red-400" : "text-slate-200"
                      }`}
                    >
                      {selectedTx.pcaHighlights?.v12?.toFixed(3) || "0.000"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl border border-white/5 bg-white/[0.02]">
                    <span className="text-slate-300">V14 (Pattern):</span>
                    <span
                      className={`font-bold ${
                        selectedTx.pcaHighlights?.v14 < -2.0 ? "text-red-400" : "text-slate-200"
                      }`}
                    >
                      {selectedTx.pcaHighlights?.v14?.toFixed(3) || "0.000"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Operational Override Buttons */}
              <div className="space-y-2 pt-2">
                <GlassButton
                  id="btn-confirm-fraud"
                  variant="danger"
                  className="w-full text-xs justify-center"
                  onClick={() => handleConfirmFraud(selectedTx)}
                  icon={ShieldAlert}
                >
                  Confirm Fraud // Freeze Account
                </GlassButton>

                <GlassButton
                  id="btn-override-fp"
                  variant="secondary"
                  className="w-full text-xs justify-center hover:border-emerald-500/40"
                  onClick={() => handleOverrideFalsePositive(selectedTx)}
                  icon={CheckCircle2}
                >
                  Override as Legitimate Variance
                </GlassButton>
              </div>

              {/* Mini Frosted Glass Card Display */}
              <div className="pt-2 flex justify-center">
                <CreditCardGraphic
                  cardNumber={selectedTx.cardNumber || "4532 •••• •••• 9928"}
                  cardHolder={selectedTx.cardHolder || "ENCLAVE CLIENT"}
                  bankName={selectedTx.bank}
                  probability={selectedTx.probability}
                  isFraud={selectedTx.is_fraud}
                  size="sm"
                  interactive={false}
                />
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              Select any transaction from the stream matrix to inspect canonical PCA tensors.
            </div>
          )}
        </GlassCard>
      </aside>

      {/* ======================================================== */}
      {/* Right Column: Live Transaction Ingestion Matrix Table    */}
      {/* ======================================================== */}
      <section className="lg:col-span-8 space-y-4">
        <GlassCard variant="elevated" className="p-0 overflow-hidden">
          {/* Header & Filter Controls */}
          <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  Live Edge Telemetry
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Transaction Ingestion Stream
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Real-time cross-institutional edge scoring. Click any transaction to inspect PCA contributors.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
              <button
                onClick={() => setFilterMode("all")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  filterMode === "all"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All ({transactions.length})
              </button>
              <button
                onClick={() => setFilterMode("alerts")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  filterMode === "alerts"
                    ? "bg-red-500/20 text-red-300 border border-red-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Alerts ({totalFlagged})
              </button>
              <button
                onClick={() => setFilterMode("approved")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  filterMode === "approved"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Safe ({transactions.length - totalFlagged})
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="px-5 py-3 border-b border-white/5 bg-white/[0.01] flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-500 shrink-0" />
            <input
              type="text"
              placeholder="Search by ID, card number, merchant, or bank..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-white placeholder:text-slate-600 focus:outline-none font-mono"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto min-h-[500px]">
            <table className="bank-table text-left">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Card / Merchant</th>
                  <th>Edge Node</th>
                  <th className="text-right">Amount</th>
                  <th>Probability</th>
                  <th>Disposition</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] font-mono text-xs">
                {filteredTransactions.map((tx) => {
                  const isSelected = selectedTx?.id === tx.id;
                  return (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "selected" : ""
                      }`}
                    >
                      <td className="font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{tx.id}</span>
                          {tx.latencyMs && (
                            <span className="text-[9px] text-slate-500">
                              {tx.latencyMs}ms
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="font-sans">
                        <div className="font-bold text-slate-200">
                          {tx.merchant || "POS Merchant Terminal"}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {tx.cardNumber || "4532 •••• •••• 9928"}
                        </div>
                      </td>

                      <td className="font-sans">
                        <span className="inline-flex items-center gap-1.5 text-slate-300">
                          <Database className="h-3.5 w-3.5 text-emerald-400" />
                          <span>{tx.bankShort || tx.bank.split(" ")[0]}</span>
                        </span>
                      </td>

                      <td className="text-right font-black text-white">
                        ${tx.amount?.toFixed(2)}
                      </td>

                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-900 border border-white/10 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                tx.probability >= 0.15 ? "bg-red-500" : "bg-emerald-400"
                              }`}
                              style={{ width: `${Math.min(100, tx.probability * 100)}%` }}
                            />
                          </div>
                          <span
                            className={`font-mono font-bold ${
                              tx.probability >= 0.15 ? "text-red-400" : "text-emerald-400"
                            }`}
                          >
                            {tx.probability.toFixed(3)}
                          </span>
                        </div>
                      </td>

                      <td>
                        <StatBadge status={tx.status} size="xs" />
                      </td>

                      <td className="text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTx(tx);
                          }}
                          className="font-bold text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 ml-auto"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

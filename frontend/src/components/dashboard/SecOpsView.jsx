"use client";

import React from "react";
import {
  Lock,
  Key,
  ShieldAlert,
  Server,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { GlassButton } from "../ui/GlassButton";
import { StatBadge } from "../ui/StatBadge";
import { useApp } from "../../context/AppContext";
import { CRYPTO_LEDGER } from "../../lib/constants";

export function SecOpsView() {
  const { nodeTokens, setNodeTokens, freezeEdgeSync, setFreezeEdgeSync } = useApp();

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <GlassCard variant="accent" className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 font-bold">
              ZERO-TRUST CRYPTOGRAPHIC DEFENSE
            </span>
            <h2 className="text-2xl font-bold text-white mt-1.5 tracking-tight">
              Node Integrity & Byzantine Poisoning Defense
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Cryptographic gradient clipping, SHA-256 model state checkpointing, and real-time edge token revocation controls.
            </p>
          </div>

          <GlassButton
            variant={freezeEdgeSync ? "danger" : "secondary"}
            onClick={() => setFreezeEdgeSync(!freezeEdgeSync)}
            icon={AlertTriangle}
          >
            <span>{freezeEdgeSync ? "Edge Sync Frozen (Emergency)" : "Freeze Edge Sync"}</span>
          </GlassButton>
        </div>
      </GlassCard>

      {/* 3 SecOps Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mutual TLS 1.3 */}
        <GlassCard variant="default" className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="h-4 w-4 text-emerald-400" />
              Mutual TLS 1.3
            </span>
            <StatBadge status="HEALTHY" size="xs" />
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-slate-400">Bank 1 Node Cert:</span>
              <span className="text-slate-200 font-bold">SHA-256 Valid (2027)</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-slate-400">Bank 2 Node Cert:</span>
              <span className="text-slate-200 font-bold">SHA-256 Valid (2027)</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-slate-400">Cipher Suite:</span>
              <span className="text-emerald-400 font-bold">TLS_AES_256_GCM</span>
            </div>
          </div>
        </GlassCard>

        {/* Byzantine Poisoning Defense */}
        <GlassCard variant="default" className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-emerald-400" />
              Byzantine Defense
            </span>
            <StatBadge status="PASSED" size="xs" />
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-slate-400">Gradient Clipping:</span>
              <span className="text-slate-200 font-bold">Norm &le; 2.50 Enforced</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-slate-400">Poisoning Score:</span>
              <span className="text-emerald-400 font-bold">0.018 (Safe &lt;0.35)</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-slate-400">Sybil Detection:</span>
              <span className="text-slate-200 font-bold">Multi-Factor Active</span>
            </div>
          </div>
        </GlassCard>

        {/* Edge Token Revocation */}
        <GlassCard variant="default" className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-400" />
              Edge Revocation
            </span>
            <StatBadge status="CONTROL" size="xs" />
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-slate-300 font-bold">Bank 1 Node:</span>
              <button
                onClick={() =>
                  setNodeTokens((prev) => ({
                    ...prev,
                    bank1: prev.bank1 === "REVOKED_YES" ? "REVOKED_NO" : "REVOKED_YES",
                  }))
                }
                className={`px-3 py-1 rounded-lg font-bold text-[10px] transition-all ${
                  nodeTokens.bank1 === "REVOKED_YES"
                    ? "bg-red-500/20 text-red-300 border border-red-500/40"
                    : "bg-white/5 text-slate-300 border border-white/10 hover:border-red-500/40 hover:text-red-300"
                }`}
              >
                {nodeTokens.bank1 === "REVOKED_YES" ? "TOKEN REVOKED" : "REVOKE TOKEN"}
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-slate-300 font-bold">Bank 2 Node:</span>
              <button
                onClick={() =>
                  setNodeTokens((prev) => ({
                    ...prev,
                    bank2: prev.bank2 === "REVOKED_YES" ? "REVOKED_NO" : "REVOKED_YES",
                  }))
                }
                className={`px-3 py-1 rounded-lg font-bold text-[10px] transition-all ${
                  nodeTokens.bank2 === "REVOKED_YES"
                    ? "bg-red-500/20 text-red-300 border border-red-500/40"
                    : "bg-white/5 text-slate-300 border border-white/10 hover:border-red-500/40 hover:text-red-300"
                }`}
              >
                {nodeTokens.bank2 === "REVOKED_YES" ? "TOKEN REVOKED" : "REVOKE TOKEN"}
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Cryptographic Ledger Table */}
      <GlassCard variant="elevated" className="p-0 overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Immutable PyTorch Checkpoint Audit Ledger (global_model.pt)
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
            SHA-256 Digest Verification
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="bank-table text-left">
            <thead>
              <tr>
                <th>Round</th>
                <th>Timestamp</th>
                <th>Aggregation Hash (SHA-256)</th>
                <th>Algorithm</th>
                <th className="text-right">Integrity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] font-mono text-xs">
              {CRYPTO_LEDGER.map((entry) => (
                <tr key={entry.round}>
                  <td className="font-bold text-white">Round {entry.round}</td>
                  <td className="text-slate-400">{entry.timestamp}</td>
                  <td className="text-slate-300 font-mono text-[11px] truncate max-w-[340px]">
                    {entry.hash}
                  </td>
                  <td className="text-slate-400">{entry.algo}</td>
                  <td className="text-right">
                    <StatBadge status={entry.status} size="xs" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

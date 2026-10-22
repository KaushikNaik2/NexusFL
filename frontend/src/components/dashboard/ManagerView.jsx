"use client";

import React from "react";
import { Scale, CheckCircle2, DollarSign, TrendingUp, ShieldCheck, AlertOctagon } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { THRESHOLD_MATRIX } from "../../lib/constants";
import { StatBadge } from "../ui/StatBadge";

export function ManagerView() {
  return (
    <div className="space-y-6">
      {/* Executive ROI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard variant="default" className="p-5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Prevented Fraud Losses
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono mt-1 text-white">
            $3,842,500
          </div>
          <div className="text-xs text-slate-400 mt-2 font-mono">
            YTD Cross-Bank Interception
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Analyst Review Overhead
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono mt-1 text-amber-400">
            $28,450
          </div>
          <div className="text-xs text-slate-400 mt-2 font-mono">
            0.74% Operational Friction
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-5 glow-emerald">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Net Capital Protected
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono mt-1 text-gradient-emerald">
            $3,814,050
          </div>
          <div className="text-xs font-bold text-emerald-400 mt-2 font-mono">
            134.0x Net Operating ROI
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            SLA Compliance Rate
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono mt-1 text-emerald-400">
            99.998%
          </div>
          <div className="text-xs text-slate-400 mt-2 font-mono">
            P95 Inference &lt; 15ms target
          </div>
        </GlassCard>
      </div>

      {/* Threshold Trade-Off Analysis Matrix */}
      <GlassCard variant="elevated" className="p-0 overflow-hidden">
        <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                Decision Threshold Trade-Off Matrix (0.15 Mandate Rationale)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Mathematical proof of why the strict 0.15 cutoff delivers maximum net capital protection vs naive 0.50 default.
            </p>
          </div>
          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
            Optimal Cutoff: 0.150
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="bank-table text-left">
            <thead>
              <tr>
                <th>Threshold</th>
                <th>Recall (Fraud Caught)</th>
                <th>Precision</th>
                <th className="text-right">Prevented Loss</th>
                <th className="text-right">Friction Overhead</th>
                <th className="text-right">Net Business Value</th>
                <th>Viability Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] font-mono text-xs">
              {THRESHOLD_MATRIX.map((row) => {
                const isOptimal = row.isRecommended;
                return (
                  <tr
                    key={row.threshold}
                    className={isOptimal ? "bg-emerald-500/[0.12] font-bold" : ""}
                  >
                    <td className="font-bold text-white">
                      <div className="flex items-center gap-2">
                        {isOptimal && (
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                        <span>{row.threshold}</span>
                      </div>
                    </td>

                    <td
                      className={
                        parseFloat(row.recall) > 85 ? "text-emerald-400 font-bold" : "text-slate-300"
                      }
                    >
                      {row.recall}
                    </td>

                    <td
                      className={
                        parseFloat(row.precision) < 50 ? "text-red-400" : "text-slate-300"
                      }
                    >
                      {row.precision}
                    </td>

                    <td className="text-right text-white font-medium">
                      {row.preventedLoss}
                    </td>

                    <td
                      className={`text-right ${
                        row.frictionOverhead.includes("640") ? "text-red-400" : "text-slate-400"
                      }`}
                    >
                      {row.frictionOverhead}
                    </td>

                    <td
                      className={`text-right font-black ${
                        isOptimal
                          ? "text-gradient-emerald text-sm"
                          : row.netValue.includes("1,737")
                          ? "text-red-400"
                          : "text-white"
                      }`}
                    >
                      {row.netValue}
                    </td>

                    <td>
                      <StatBadge status={row.status} size="xs" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Compliance & Governance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard variant="default" className="p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            GDPR Article 25 (Privacy by Design)
          </div>
          <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
            Zero raw PII leaves bank perimeters. Only differential privacy bounded parameter updates cross institutional boundaries.
          </p>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            RBI Master Directions on Cyber Security
          </div>
          <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
            Data localization maintained 100% within sovereign bank on-premise and local cloud enclaves. No international data transits.
          </p>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Basel III Operational Resilience
          </div>
          <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
            Demonstrable operational resilience and quantifiable loss reduction backed by cryptographic SHA-256 digest audits.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}

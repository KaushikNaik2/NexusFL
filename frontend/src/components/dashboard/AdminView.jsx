"use client";

import React from "react";
import {
  Network,
  BarChart3,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Database,
  Cpu,
  Layers,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { FEDERATED_ROUNDS_DATA } from "../../lib/constants";

export function AdminView() {
  return (
    <div className="space-y-6">
      {/* Zero-Knowledge Privacy Banner */}
      <GlassCard variant="accent" className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 flex items-center justify-center shrink-0 text-black font-black shadow-[0_0_20px_rgba(34,197,94,0.4)]">
            <Network className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                FEDPROX PROTOCOL (μ = 0.1) • ZERO-KNOWLEDGE
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1.5 tracking-tight">
              Cross-Bank Federated Learning Enclave
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2 max-w-4xl">
              Proprietary banking data never leaves Bank 1 (Relational SQL) or Bank 2 (NoSQL Document Enclave).
              Only decentralized PyTorch weight tensors (&Delta;W &isin; &#8477;<sup>4,129</sup>) are aggregated across
              communication rounds over encrypted WireGuard mesh. Zero customer balance or PII is exposed.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard variant="default" className="p-5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Global Model PR-AUC
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono mt-1 text-gradient-emerald">
            0.842
          </div>
          <div className="text-xs font-bold text-emerald-400 mt-2 flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+18.4% vs Siloed Models</span>
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Weight Drift / Divergence
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono mt-1 text-white">
            0.042
          </div>
          <div className="text-xs text-slate-400 mt-2 font-mono">
            Euclidean Norm &Vert;&Delta;W₁ - &Delta;W₂&Vert;
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Privacy Budget (DP-SGD)
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono mt-1 text-white">
            &epsilon; = 1.20
          </div>
          <div className="text-xs text-slate-400 mt-2 font-mono">
            &delta; = 10⁻⁵ Strict Bound
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Consensus Quorum
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono mt-1 text-emerald-400">
            2 / 2 Nodes
          </div>
          <div className="text-xs text-slate-400 mt-2 font-mono">
            100% Round Consensus
          </div>
        </GlassCard>
      </div>

      {/* Convergence Chart Container (Styled like Image 2 dark area chart) */}
      <GlassCard variant="elevated" className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                Federated Convergence Across 10 Communication Rounds
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              PR-AUC trajectory: Global FedProx vs Edge Bank isolated baselines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
              ● Global FedProx (0.842)
            </span>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
              ● Bank 1 Local (0.761)
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
              ● Bank 2 Local (0.724)
            </span>
          </div>
        </div>

        {/* Clean Glowing SVG Area & Line Chart */}
        <div className="mt-6 p-4 rounded-2xl bg-black/50 border border-white/5 h-80 w-full relative overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="none">
            <defs>
              <linearGradient id="globalAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0.5, 0.6, 0.7, 0.8, 0.9].map((val, idx) => {
              const y = 210 - (val - 0.5) * 450;
              return (
                <g key={idx}>
                  <line
                    x1="50"
                    y1={y}
                    x2="780"
                    y2={y}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x="10"
                    y={y + 4}
                    fill="#64748b"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {val.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* X-Axis Round Labels */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => {
              const x = 50 + (r - 1) * (730 / 9);
              return (
                <text
                  key={r}
                  x={x}
                  y="230"
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  R{r}
                </text>
              );
            })}

            {/* Global Area Gradient Fill (from Image 2) */}
            <polygon
              fill="url(#globalAreaGrad)"
              points={`50,210 ${FEDERATED_ROUNDS_DATA.map(
                (d, i) => `${50 + i * (730 / 9)},${210 - (d.globalPrAuc - 0.5) * 450}`
              ).join(" ")} 780,210`}
            />

            {/* Bank 2 Curve (Amber) */}
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="4 2"
              opacity="0.8"
              points={FEDERATED_ROUNDS_DATA.map(
                (d, i) => `${50 + i * (730 / 9)},${210 - (d.bank2PrAuc - 0.5) * 450}`
              ).join(" ")}
            />

            {/* Bank 1 Curve (Cyan) */}
            <polyline
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="4 2"
              opacity="0.8"
              points={FEDERATED_ROUNDS_DATA.map(
                (d, i) => `${50 + i * (730 / 9)},${210 - (d.bank1PrAuc - 0.5) * 450}`
              ).join(" ")}
            />

            {/* Global FedProx Curve (Lush Glowing Emerald) */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeLinecap="round"
              filter="drop-shadow(0px 0px 8px rgba(16, 185, 129, 0.7))"
              points={FEDERATED_ROUNDS_DATA.map(
                (d, i) => `${50 + i * (730 / 9)},${210 - (d.globalPrAuc - 0.5) * 450}`
              ).join(" ")}
            />

            {/* End Point Glow Indicator */}
            <circle
              cx="780"
              cy={210 - (0.842 - 0.5) * 450}
              r="6"
              fill="#22c55e"
              stroke="#fff"
              strokeWidth="2"
              filter="drop-shadow(0px 0px 10px #22c55e)"
            />
          </svg>
        </div>
      </GlassCard>

      {/* Institutional Edge Node Architecture Matrix Table */}
      <GlassCard variant="elevated" className="p-0 overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Institutional Edge Node Architecture Matrix
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
            Zero Data Leakage
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="bank-table text-left">
            <thead>
              <tr>
                <th>Node Designation</th>
                <th>Adapter Architecture</th>
                <th className="text-right">Edge Sample Size</th>
                <th className="text-right">Local Isolated PR-AUC</th>
                <th className="text-right">Global FedProx</th>
                <th className="text-right">Net Gain</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] font-mono text-xs">
              <tr>
                <td className="font-bold text-white">Bank 1 (Node Alpha)</td>
                <td className="font-sans text-slate-300">Relational SQL Adapter (PostgreSQL)</td>
                <td className="text-right text-slate-400">142,400 rows</td>
                <td className="text-right text-slate-300">0.761</td>
                <td className="text-right font-bold text-emerald-400">0.839</td>
                <td className="text-right font-black text-emerald-400">+10.2%</td>
                <td>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active Sync
                  </span>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-white">Bank 2 (Node Beta)</td>
                <td className="font-sans text-slate-300">NoSQL JSON Document Adapter (MongoDB)</td>
                <td className="text-right text-slate-400">89,200 docs</td>
                <td className="text-right text-slate-300">0.724</td>
                <td className="text-right font-bold text-emerald-400">0.845</td>
                <td className="text-right font-black text-emerald-400">+16.7%</td>
                <td>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active Sync
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

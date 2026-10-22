"use client";

import React from "react";
import { ShieldAlert, Cpu, Network, Scale, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";

export function FeatureGrid() {
  const FEATURES = [
    {
      title: "Zero-Knowledge Security Guarantee",
      subtitle: "Differential Privacy & WireGuard Enclave",
      icon: ShieldAlert,
      tag: "GDPR Art. 25 • RBI Localized",
      description:
        "Customer accounts, balances, and PII never leave sovereign bank premises. Edge nodes exchange only PyTorch gradient tensors bounded by DP-SGD (ε=1.20, δ=10⁻⁵).",
      metrics: "Zero Raw Leakage Guaranteed",
    },
    {
      title: "Low-Latency Real-Time Scoring",
      subtitle: "FastAPI P95 < 3.8ms at 500 VUs",
      icon: Cpu,
      tag: "Sub-Millisecond Pipeline",
      description:
        "Pre-compiled PyTorch FraudMLP inference engine processes canonical 30-feature vectors in under 4 milliseconds to intercept high-velocity transaction fraud in flight.",
      metrics: "P95 < 3.8ms at 500 VUs",
    },
    {
      title: "Heterogeneous Edge Schema Adapters",
      subtitle: "Relational SQL & NoSQL Document Interop",
      icon: Network,
      tag: "FedProx μ=0.1 Convergence",
      description:
        "Transforms disparate bank architectures—Bank 1 PostgreSQL rows and Bank 2 MongoDB payloads—into unified canonical tensors without manual schema restructuring.",
      metrics: "2 Edge Nodes Quorum",
    },
    {
      title: "The 0.15 Decision Threshold Mandate",
      subtitle: "Optimized for Extreme 0.172% Fraud Imbalance",
      icon: Scale,
      tag: "Maximum Capital Preservation",
      description:
        "Standard 0.50 cutoffs miss 58.8% of fraud. Enforcing the strict 0.15 threshold boosts catch rate to 89.5% with only $28k analyst overhead, yielding $3.81M net savings.",
      metrics: "+28.3% Caught vs Default",
    },
  ];

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
          Institutional Architecture
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
          What Sets <span className="text-gradient-emerald">NexusFL</span> Apart
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2.5">
          Engineered for Tier-1 multi-bank fraud consortiums operating under strict Basel III and sovereign privacy regulations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FEATURES.map((feat) => {
          const Icon = feat.icon;
          return (
            <GlassCard
              key={feat.title}
              variant="default"
              className="p-6 sm:p-7 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-300">
                    {feat.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs font-mono text-emerald-400/80 mt-0.5">
                  {feat.subtitle}
                </p>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-3">
                  {feat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Performance Benchmark
                </span>
                <span className="font-bold text-emerald-400">{feat.metrics}</span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}

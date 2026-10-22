"use client";

import React from "react";
import { ShieldCheck, Lock, ExternalLink } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#060c08]/90 py-10 px-4 sm:px-6 lg:px-8 mt-16 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-white tracking-tight">
              NexusFL Cross-Institutional Framework &copy; 2026
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Decentralized Zero-Trust Banking Intelligence • Tier-1 Mesh Protocol
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-slate-300">
            <Lock className="h-3 w-3 text-emerald-400" />
            GDPR Art. 25
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">RBI Data Localization</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">Basel III Compliant</span>
          <span className="text-slate-600">•</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SECURE FEDERATION ACTIVE
          </span>
        </div>
      </div>
    </footer>
  );
}

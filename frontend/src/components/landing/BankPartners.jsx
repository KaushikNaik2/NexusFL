"use client";

import React from "react";
import { PARTNER_BANKS } from "../../lib/constants";
import { Building2, ShieldCheck } from "lucide-react";

export function BankPartners() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-6">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          Active Cross-Institutional Federation Enclaves
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {PARTNER_BANKS.map((bank) => (
          <div
            key={bank.name}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-emerald-500/[0.08] hover:border-emerald-500/30 transition-all duration-200 text-center group"
          >
            <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition-colors mb-1.5">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="font-bold text-xs text-slate-200 group-hover:text-white transition-colors">
              {bank.name}
            </span>
            <span className="text-[9px] font-mono text-emerald-400/70 mt-0.5">
              {bank.tier}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

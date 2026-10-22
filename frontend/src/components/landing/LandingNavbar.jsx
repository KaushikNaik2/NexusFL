"use client";

import React from "react";
import { ShieldCheck, LogIn, ArrowRight, Activity } from "lucide-react";
import { GlassButton } from "../ui/GlassButton";
import { useApp } from "../../context/AppContext";

export function LandingNavbar() {
  const { setCurrentView, openAuthModal, apiStatus } = useApp();

  return (
    <header className="relative z-30 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
      <div className="flex h-16 items-center justify-between rounded-2xl border border-white/10 bg-[#0a140f]/70 px-4 sm:px-6 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]">
        {/* Brand */}
        <div
          onClick={() => setCurrentView("welcome")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 text-black font-black shadow-[0_0_20px_rgba(34,197,94,0.4)] group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-6 w-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                Nexus<span className="text-emerald-400">FL</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                BANKING MESH v2.4
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
              Cross-Institutional Zero-Trust Intelligence
            </span>
          </div>
        </div>

        {/* Status Center Pill */}
        <div className="hidden lg:flex items-center gap-3 px-3.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-950/20 text-xs font-mono">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300">
            FastAPI:{" "}
            <strong className={apiStatus.connected ? "text-emerald-400" : "text-amber-400"}>
              {apiStatus.connected ? `Online (${apiStatus.latency}ms)` : "Standby (Sim)"}
            </strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">
            SLA: <strong className="text-emerald-400">0.150 Mandate</strong>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <GlassButton
            id="btn-nav-sign-in"
            variant="ghost"
            size="sm"
            onClick={() => openAuthModal("login")}
            icon={LogIn}
          >
            <span>Sign In</span>
          </GlassButton>

          <GlassButton
            id="btn-nav-open-console"
            variant="primary"
            size="sm"
            onClick={() => setCurrentView("dashboard")}
          >
            <span>Open Console</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </GlassButton>
        </div>
      </div>
    </header>
  );
}

"use client";

import React from "react";
import {
  ShieldCheck,
  Activity,
  Network,
  Lock,
  Scale,
  Play,
  Pause,
  LogOut,
  Home,
  User,
  Radio,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export function DashboardNavbar() {
  const {
    activeRole,
    setActiveRole,
    currentUser,
    apiStatus,
    isLiveStreaming,
    setIsLiveStreaming,
    setCurrentView,
    handleLogout,
  } = useApp();

  const roles = [
    { id: "analyst", label: "Analyst Triage", icon: Activity },
    { id: "admin", label: "Federated Analytics", icon: Network },
    { id: "secops", label: "SecOps & Integrity", icon: Lock },
    { id: "manager", label: "Bank Manager (ROI)", icon: Scale },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070e0a]/85 backdrop-blur-2xl px-4 sm:px-6 py-3.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]">
      <div className="max-w-[1780px] mx-auto flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setCurrentView("welcome")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 text-black font-black cursor-pointer shadow-[0_0_20px_rgba(34,197,94,0.4)]"
          >
            <ShieldCheck className="h-6 w-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">
                Nexus<span className="text-emerald-400">FL</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                v2.4-PROD
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Decentralized Cross-Bank Federated Intelligence Matrix
            </p>
          </div>
        </div>

        {/* Role Navigation Strip (Segmented Pill Buttons from Image 2) */}
        <nav
          className="flex items-center gap-1.5 p-1 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl"
          aria-label="Operational Role Selection"
        >
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = activeRole === r.id;
            return (
              <button
                key={r.id}
                id={`btn-role-${r.id}`}
                onClick={() => setActiveRole(r.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 select-none ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-lime-500 text-black shadow-[0_0_20px_-3px_rgba(34,197,94,0.5)]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-black" : "text-emerald-400"}`} />
                <span>{r.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Live Telemetry Cluster & User Profile */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* FastAPI Health Pill */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold backdrop-blur-md ${
              apiStatus.connected
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                : "bg-amber-500/15 border-amber-500/30 text-amber-300"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                apiStatus.connected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span>
              FastAPI: {apiStatus.connected ? `Online (${apiStatus.latency}ms)` : "Standby (Sim)"}
            </span>
          </div>

          {/* SLA Cutoff Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-mono text-slate-300">
            <span className="text-slate-400">Cutoff:</span>
            <span className="font-bold text-emerald-400">0.150 Strict</span>
          </div>

          {/* Stream Ingestion Toggle */}
          <button
            id="btn-toggle-stream"
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 select-none shadow-md ${
              isLiveStreaming
                ? "bg-red-500/20 border border-red-500/40 text-red-300 shadow-[0_0_20px_-5px_rgba(239,68,68,0.4)]"
                : "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] hover:bg-emerald-500/30"
            }`}
            title="Toggle simulated live bank transaction stream"
          >
            {isLiveStreaming ? (
              <>
                <Pause className="h-3.5 w-3.5 animate-pulse text-red-400" />
                <span>Pause Ingestion</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-emerald-400" />
                <span>Live Ingestion</span>
              </>
            )}
          </button>

          {/* User Session Profile Badge */}
          <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 pl-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500/20 to-lime-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
              {currentUser?.name ? currentUser.name.charAt(0) : "U"}
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">{currentUser?.name}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {currentUser?.clearance?.split("-")[0] || "Auth"}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[130px]">
                {currentUser?.institution}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1"
              title="Sign Out to Public Gateway"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => setCurrentView("welcome")}
            className="p-2 rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white hover:border-emerald-500/40 transition-colors"
            title="Return to Public Landing Page"
          >
            <Home className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

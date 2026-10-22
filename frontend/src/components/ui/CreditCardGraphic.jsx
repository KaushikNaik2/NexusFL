"use client";

import React from "react";
import { Wifi, ShieldCheck, ShieldAlert, Cpu } from "lucide-react";

export function CreditCardGraphic({
  cardNumber = "1602 0911 2019 2821",
  cardHolder = "ALEXANDER WRIGHT",
  expires = "09/31",
  cardType = "Nexus Infinite Enclave",
  bankName = "GreenBank // Zero-Trust Node Alpha",
  probability = 0.012,
  isFraud = false,
  status = "APPROVED",
  interactive = true,
  size = "default", // "sm" | "default" | "lg"
  variant = "emerald", // "emerald" | "frosted" | "dark"
}) {
  const isHighRisk = isFraud || probability >= 0.15;

  const sizeClasses = {
    sm: "w-[290px] h-[175px] p-4 text-[10px]",
    default: "w-[360px] h-[220px] p-6 text-xs",
    lg: "w-[410px] h-[250px] p-7 text-sm",
  };

  const gradientStyles = {
    emerald: "from-emerald-500/20 via-emerald-950/40 to-[#041a10]/85 border-emerald-400/30 text-white shadow-[0_20px_45px_-12px_rgba(0,0,0,0.8),0_0_35px_-5px_rgba(16,185,129,0.25)]",
    alert: "from-red-500/20 via-red-950/40 to-[#1a0505]/85 border-red-500/30 text-white shadow-[0_20px_45px_-12px_rgba(0,0,0,0.8),0_0_35px_-5px_rgba(239,68,68,0.25)]",
    frosted: "from-white/10 via-slate-900/60 to-[#07130c]/80 border-white/20 text-white shadow-[0_20px_45px_-12px_rgba(0,0,0,0.8),0_0_35px_-5px_rgba(255,255,255,0.1)]",
  };

  const activeGradient = isHighRisk ? gradientStyles.alert : gradientStyles[variant] || gradientStyles.emerald;

  return (
    <div
      className={`relative rounded-[22px] border backdrop-blur-2xl bg-gradient-to-br flex flex-col justify-between overflow-hidden transition-all duration-300 ${
        sizeClasses[size] || sizeClasses.default
      } ${activeGradient} ${interactive ? "hover:scale-[1.02] hover:-translate-y-1.5" : ""}`}
    >
      {/* Decorative luminous orb in corner */}
      <div
        className={`absolute -right-10 -bottom-10 w-44 h-44 rounded-full blur-2xl pointer-events-none opacity-50 ${
          isHighRisk ? "bg-red-500/30" : "bg-emerald-400/30"
        }`}
      />

      {/* Top Row: Bank branding, Chip & Contactless */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-md bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center">
              <span className="text-[10px] font-black text-emerald-400">N</span>
            </div>
            <span className="font-extrabold tracking-wider text-[11px] uppercase text-emerald-300">
              {bankName.split("//")[0]}
            </span>
          </div>
          <p className="text-[9px] font-mono text-slate-400 mt-0.5 tracking-tight">
            {cardType}
          </p>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <Wifi className="h-4 w-4 rotate-90 opacity-80" />
          <div className="flex -space-x-2 opacity-90">
            <div className="h-5 w-5 rounded-full bg-emerald-400/80 mix-blend-screen" />
            <div className="h-5 w-5 rounded-full bg-lime-300/80 mix-blend-screen" />
          </div>
        </div>
      </div>

      {/* Middle Row: EMV Chip & Real-Time Risk Pill */}
      <div className="relative z-10 flex items-center justify-between my-auto">
        {/* EMV Microchip */}
        <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-200 via-amber-400 to-yellow-100 border border-amber-500/60 p-1 flex items-center justify-center shadow-inner relative overflow-hidden">
          <div className="w-full h-full border border-amber-600/40 rounded-sm grid grid-cols-2 gap-0.5">
            <div className="border-r border-b border-amber-700/30" />
            <div className="border-b border-amber-700/30" />
            <div className="border-r border-amber-700/30" />
            <div />
          </div>
          <Cpu className="h-3 w-3 text-amber-900/40 absolute" />
        </div>

        {/* Live Enclave Verification Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold tracking-tight backdrop-blur-md ${
            isHighRisk
              ? "bg-red-500/15 border-red-500/40 text-red-300"
              : "bg-emerald-500/15 border-emerald-400/40 text-emerald-300"
          }`}
        >
          {isHighRisk ? (
            <ShieldAlert className="h-3 w-3 text-red-400 shrink-0" />
          ) : (
            <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
          )}
          <span>
            {isHighRisk ? `Risk: ${probability.toFixed(3)}` : `Safe: ${probability.toFixed(3)}`}
          </span>
          <span
            className={`h-1.5 w-1.5 rounded-full animate-pulse ${
              isHighRisk ? "bg-red-400" : "bg-emerald-400"
            }`}
          />
        </div>
      </div>

      {/* Bottom Area: Embossed Card Number, Holder, Expiry */}
      <div className="relative z-10 space-y-2">
        <div className="font-mono text-base tracking-[0.18em] font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {cardNumber}
        </div>

        <div className="flex items-end justify-between text-[10px] font-mono uppercase text-slate-300">
          <div>
            <span className="block text-[8px] text-slate-400 tracking-wider">Cardholder</span>
            <span className="font-semibold text-white tracking-wide">{cardHolder}</span>
          </div>

          <div className="text-right">
            <span className="block text-[8px] text-slate-400 tracking-wider">Expires</span>
            <span className="font-semibold text-white">{expires}</span>
          </div>

          <div className="text-right">
            <span className="block text-[8px] text-slate-400 tracking-wider">Enclave SLA</span>
            <span className="font-bold text-emerald-400">0.15 Cutoff</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";

export function GlassCard({
  children,
  className = "",
  variant = "default", // "default" | "elevated" | "accent" | "interactive"
  glow = false,
  onClick,
}) {
  const baseClasses = "relative overflow-hidden transition-all duration-300";
  
  const variantClasses = {
    default: "glass-card p-5",
    elevated: "glass-panel-elevated p-6",
    subtle: "bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-2xl p-5",
    accent: "bg-[#0c1a12]/80 border border-emerald-500/30 backdrop-blur-xl rounded-2xl p-5 shadow-[0_0_25px_-5px_rgba(16,185,129,0.15)]",
    interactive: "glass-card p-5 cursor-pointer hover:border-emerald-500/50 hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.25)]",
  };

  const glowClass = glow ? "shadow-[0_0_35px_-5px_rgba(34,197,94,0.25)] border-emerald-500/40" : "";

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${glowClass} ${className}`}
    >
      {children}
    </div>
  );
}

export function GlassCardHeader({ title, subtitle, badge, icon: Icon, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-white/[0.06]">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-white tracking-tight">{title}</h3>
            {badge}
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

"use client";

import React from "react";

export function GlassButton({
  children,
  onClick,
  variant = "primary", // "primary" | "secondary" | "danger" | "ghost"
  size = "default", // "sm" | "default" | "lg"
  icon: Icon,
  className = "",
  disabled = false,
  type = "button",
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    default: "px-5 py-2.5 text-xs sm:text-sm gap-2",
    lg: "px-7 py-3.5 text-sm sm:text-base gap-2.5 rounded-2xl",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-emerald-400 to-lime-400 hover:from-emerald-300 hover:to-lime-300 text-black font-extrabold shadow-[0_0_25px_-5px_rgba(34,197,94,0.4)] hover:shadow-[0_0_35px_-3px_rgba(34,197,94,0.6)] active:scale-[0.98]",
    secondary:
      "bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 hover:border-emerald-500/40 backdrop-blur-xl shadow-lg active:scale-[0.98]",
    danger:
      "bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 hover:border-red-500/50 backdrop-blur-xl shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)] active:scale-[0.98]",
    ghost:
      "text-slate-300 hover:text-white hover:bg-white/[0.05] active:scale-[0.98]",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {children}
    </button>
  );
}

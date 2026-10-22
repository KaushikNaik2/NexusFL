"use client";

import React from "react";

export function StatBadge({ status, type = "auto", size = "default" }) {
  let badgeColor = "emerald";
  let label = status;

  if (type === "auto") {
    if (
      status === "CRITICAL_ALERT" ||
      status?.includes("ALERT") ||
      status === "FROZEN // FRAUD" ||
      status === "danger" ||
      status?.includes("Lost")
    ) {
      badgeColor = "red";
    } else if (
      status === "APPROVED" ||
      status === "VERIFIED" ||
      status === "optimal" ||
      status === "HEALTHY" ||
      status === "PASSED" ||
      status?.includes("Optimal") ||
      status?.includes("Maximum")
    ) {
      badgeColor = "emerald";
    } else if (
      status === "FALSE_POSITIVE" ||
      status === "OVERRIDDEN" ||
      status === "warning" ||
      status === "CONTROL" ||
      status?.includes("Overwhelmed")
    ) {
      badgeColor = "amber";
    } else if (status === "STANDBY" || status === "neutral" || status?.includes("Leakage")) {
      badgeColor = "slate";
    }
  }

  const styles = {
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_-2px_rgba(16,185,129,0.25)]",
    red: "bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_12px_-2px_rgba(239,68,68,0.25)]",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-[0_0_12px_-2px_rgba(245,158,11,0.25)]",
    lime: "bg-lime-500/10 border-lime-500/30 text-lime-400 shadow-[0_0_12px_-2px_rgba(163,230,53,0.25)]",
    slate: "bg-slate-800/40 border-slate-700/60 text-slate-300",
  };

  const dots = {
    emerald: "bg-emerald-400",
    red: "bg-red-400",
    amber: "bg-amber-400",
    lime: "bg-lime-400",
    slate: "bg-slate-400",
  };

  const sizeClasses = {
    xs: "px-2 py-0.5 text-[9px]",
    default: "px-2.5 py-1 text-[11px]",
    lg: "px-3.5 py-1.5 text-xs font-bold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono font-semibold tracking-wide backdrop-blur-md uppercase ${
        styles[badgeColor]
      } ${sizeClasses[size]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${dots[badgeColor]}`} />
      <span>{label}</span>
    </span>
  );
}

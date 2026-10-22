"use client";

import React from "react";
import { STATS_HIGHLIGHTS } from "../../lib/constants";

export function InstitutionalStats() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Sleek horizontal glassmorphism bar (Directly inspired by Image 1) */}
      <div className="relative rounded-3xl border border-white/10 bg-[#0c1812]/80 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8),0_0_35px_-5px_rgba(16,185,129,0.15)]">
        {/* Subtle ambient green glow along top edge */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
          {STATS_HIGHLIGHTS.map((stat, idx) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center text-center ${
                idx !== 0 ? "pt-6 lg:pt-0 lg:pl-6" : ""
              }`}
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight mb-1 text-white">
                {stat.highlight ? (
                  <span className="text-gradient-emerald">{stat.value}</span>
                ) : (
                  <span>{stat.value}</span>
                )}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-200 tracking-wide mt-1">
                {stat.label}
              </div>
              <div className="text-[11px] font-mono text-emerald-400/80 mt-0.5">
                {stat.caption}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

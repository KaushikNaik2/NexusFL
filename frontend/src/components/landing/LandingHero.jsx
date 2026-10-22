"use client";

import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Lock, Cpu } from "lucide-react";
import { GlassButton } from "../ui/GlassButton";
import { BankCardsHero } from "./BankCardsHero";
import { useApp } from "../../context/AppContext";
import { DEMO_PERSONAS } from "../../lib/constants";

export function LandingHero() {
  const { setCurrentView, openAuthModal, handleLoginSuccess } = useApp();

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Headlines & Call-to-Actions */}
        <div className="lg:col-span-7 space-y-7">
          {/* Top Pill (from Image 2) */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/30 backdrop-blur-md text-emerald-400 text-xs font-mono font-semibold shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)]">
            <Sparkles className="h-3.5 w-3.5 text-lime-400 animate-spin-slow" />
            <span>Your AI Banking & Cross-Institutional FL Partner</span>
          </div>

          {/* Headline with glowing gradient words (from Image 1 & 2) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
            Smart Systems,{" "}
            <span className="text-gradient-emerald">Collaborate Seamlessly</span>,{" "}
            <span className="text-white">Protect Capital</span>{" "}
            <span className="text-gradient-emerald">Effortlessly</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
            NexusFL unites competing financial institutions into a shared, zero-trust fraud intelligence network.
            Train state-of-the-art neural detection models collaboratively over encrypted WireGuard mesh without
            ever sharing proprietary customer balances, account numbers, or raw transactional data.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <GlassButton
              id="btn-hero-launch-console"
              variant="primary"
              size="lg"
              onClick={() => setCurrentView("dashboard")}
            >
              <span>Launch Live Console</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </GlassButton>

            <GlassButton
              id="btn-hero-sign-in"
              variant="secondary"
              size="lg"
              onClick={() => openAuthModal("login")}
            >
              <span>Enclave Sign In</span>
            </GlassButton>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PyTorch • Flower 1.7 FedProx</span>
            </div>
          </div>

          {/* Quick 1-Click Demo Evaluation Persona Switcher */}
          <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Zap className="h-3.5 w-3.5 text-emerald-400" />
                Quick 1-Click Persona Evaluation:
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                Instant Access
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {DEMO_PERSONAS.map((persona) => (
                <button
                  key={persona.role}
                  id={`btn-persona-${persona.role}`}
                  onClick={() => handleLoginSuccess(persona)}
                  className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-emerald-500/15 hover:border-emerald-500/40 text-left transition-all duration-200 group flex flex-col justify-between"
                  title={`Instant switch to ${persona.title}`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-base">{persona.iconEmoji}</span>
                    <span className="text-[9px] font-mono text-slate-400 group-hover:text-emerald-300">
                      →
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                      {persona.title}
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 truncate mt-0.5">
                      {persona.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 3D Frosted Banking Cards Showcase */}
        <div className="lg:col-span-5 flex justify-center">
          <BankCardsHero />
        </div>
      </div>
    </section>
  );
}

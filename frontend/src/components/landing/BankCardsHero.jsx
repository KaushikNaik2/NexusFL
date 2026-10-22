"use client";

import React, { useState } from "react";
import { CreditCardGraphic } from "../ui/CreditCardGraphic";
import { ShieldCheck, Sparkles, Layers } from "lucide-react";

export function BankCardsHero() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const CARDS = [
    {
      id: "card-1",
      bankName: "GreenBank // Zero-Trust Node Alpha",
      cardType: "Visa Infinite Enclave Platinum",
      cardNumber: "1602 0911 2019 2821",
      cardHolder: "DR. VIKRAM SETH",
      expires: "08/30",
      probability: 0.012,
      isFraud: false,
      variant: "emerald",
      badgeText: "Bank 1 (PostgreSQL Enclave)",
    },
    {
      id: "card-2",
      bankName: "Barclays Private // NoSQL Node Beta",
      cardType: "Corporate World Elite Titanium",
      cardNumber: "4532 8819 7462 9928",
      cardHolder: "ANYA ROSTOVA",
      expires: "12/29",
      probability: 0.842,
      isFraud: true,
      variant: "alert",
      badgeText: "Bank 2 (NoSQL Anomaly Caught)",
    },
    {
      id: "card-3",
      bankName: "NexusFL // Parameter Enclave Central",
      cardType: "FedProx Interbank Master Card",
      cardNumber: "5412 3390 1082 4410",
      cardHolder: "ELENA ROSTOVA",
      expires: "05/31",
      probability: 0.004,
      variant: "frosted",
      badgeText: "Consensus Model Checkpoint",
    },
  ];

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center select-none">
      {/* Background Luminous Ambient Green Sphere (from Image 1) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-emerald-500/25 to-lime-400/35 blur-3xl pointer-events-none" />

      {/* Decorative SVG Light Trail (Green curved path from Image 1) */}
      <svg
        className="absolute -top-12 -left-16 w-[125%] h-[125%] pointer-events-none z-0 hidden sm:block opacity-60"
        viewBox="0 0 600 500"
        fill="none"
      >
        <path
          d="M 50 120 Q 300 20 450 150 T 350 420"
          stroke="url(#greenTrailGradient)"
          strokeWidth="2.5"
          className="light-trail-path"
        />
        <defs>
          <linearGradient id="greenTrailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#22c55e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a3e635" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Primary Floating Credit Card Graphic (from Image 1) */}
      <div className="relative z-10 float-subtle">
        <CreditCardGraphic
          bankName={CARDS[activeCardIndex].bankName}
          cardType={CARDS[activeCardIndex].cardType}
          cardNumber={CARDS[activeCardIndex].cardNumber}
          cardHolder={CARDS[activeCardIndex].cardHolder}
          expires={CARDS[activeCardIndex].expires}
          probability={CARDS[activeCardIndex].probability}
          isFraud={CARDS[activeCardIndex].isFraud}
          variant={CARDS[activeCardIndex].variant}
          size="default"
        />
      </div>

      {/* Interactive Layered Card Stack Preview (from Image 1 lower section) */}
      <div className="relative z-20 mt-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-2 px-2 text-xs">
          <span className="text-slate-400 font-mono flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-emerald-400" />
            Multi-Bank Card Enclaves:
          </span>
          <span className="text-[11px] font-bold text-emerald-400">
            Click to switch node card
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {CARDS.map((card, idx) => {
            const isSelected = activeCardIndex === idx;
            return (
              <button
                key={card.id}
                onClick={() => setActiveCardIndex(idx)}
                className={`p-2.5 rounded-xl border text-left transition-all duration-200 backdrop-blur-md ${
                  isSelected
                    ? "bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_20px_-3px_rgba(16,185,129,0.35)] scale-[1.03]"
                    : "bg-black/40 border-white/10 text-slate-400 hover:border-emerald-500/30 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono font-bold uppercase text-emerald-400">
                    Card #{idx + 1}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      card.isFraud ? "bg-red-400" : "bg-emerald-400"
                    }`}
                  />
                </div>
                <div className="font-mono text-[10px] font-bold truncate">
                  {card.cardNumber.slice(0, 9)}...
                </div>
                <div className="text-[9px] text-slate-400 truncate mt-0.5">
                  {card.cardHolder}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

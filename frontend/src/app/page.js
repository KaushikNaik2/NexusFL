"use client";

import React from "react";
import { AppProvider, useApp } from "../context/AppContext";
import { LandingNavbar } from "../components/landing/LandingNavbar";
import { LandingHero } from "../components/landing/LandingHero";
import { InstitutionalStats } from "../components/landing/InstitutionalStats";
import { BankPartners } from "../components/landing/BankPartners";
import { FeatureGrid } from "../components/landing/FeatureGrid";
import { LandingFooter } from "../components/landing/LandingFooter";
import { DashboardNavbar } from "../components/dashboard/DashboardNavbar";
import { AnalystView } from "../components/dashboard/AnalystView";
import { AdminView } from "../components/dashboard/AdminView";
import { SecOpsView } from "../components/dashboard/SecOpsView";
import { ManagerView } from "../components/dashboard/ManagerView";
import { AuthModal } from "../components/auth/AuthModal";
import { CheckCircle2 } from "lucide-react";

function NexusFLPlatformContent() {
  const { currentView, activeRole, auditNotice } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#050907] text-white selection:bg-emerald-500 selection:text-black">
      {/* Real-time Notification Banner */}
      {auditNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl border border-emerald-500/40 bg-[#0c1a13]/95 text-white text-xs flex items-center gap-3 backdrop-blur-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.9),0_0_30px_-5px_rgba(16,185,129,0.3)] animate-bounce-subtle">
          <div className="h-8 w-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-emerald-300">Enclave Audit Trail Logged</div>
            <div className="text-slate-300 mt-0.5 font-mono">{auditNotice}</div>
          </div>
        </div>
      )}

      {/* View 1: Welcome / Institutional Landing Screen */}
      {currentView === "welcome" && (
        <div className="flex-1 flex flex-col">
          <LandingNavbar />
          <main className="flex-1">
            <LandingHero />
            <InstitutionalStats />
            <BankPartners />
            <FeatureGrid />
          </main>
          <LandingFooter />
        </div>
      )}

      {/* View 2: Full Bank Console Dashboard */}
      {currentView === "dashboard" && (
        <div className="flex-1 flex flex-col">
          <DashboardNavbar />
          <main className="flex-1 max-w-[1780px] w-full mx-auto p-4 sm:p-6 lg:p-8">
            {activeRole === "analyst" && <AnalystView />}
            {activeRole === "admin" && <AdminView />}
            {activeRole === "secops" && <SecOpsView />}
            {activeRole === "manager" && <ManagerView />}
          </main>
          <LandingFooter />
        </div>
      )}

      {/* Modal Dialog for Authentication */}
      <AuthModal />
    </div>
  );
}

export default function NexusFLPlatform() {
  return (
    <AppProvider>
      <NexusFLPlatformContent />
    </AppProvider>
  );
}

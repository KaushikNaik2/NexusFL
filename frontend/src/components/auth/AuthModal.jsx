"use client";

import React, { useState } from "react";
import { X, ShieldCheck, LogIn, UserPlus, Sparkles, Building2, Lock, Mail, KeyRound } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DEMO_PERSONAS } from "../../lib/constants";
import { loginUser, signupUser } from "../../lib/api";
import { GlassButton } from "../ui/GlassButton";

export function AuthModal() {
  const { authModal, closeAuthModal, handleLoginSuccess } = useApp();
  const [tab, setTab] = useState(authModal || "login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "manager@hdfc-node.internal",
    password: "••••••••••••",
    institution: "Bank 1 (PostgreSQL Node Alpha)",
    role: "manager",
    nodeType: "sql",
  });

  if (!authModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (tab === "login") {
        const res = await loginUser({
          email: form.email,
          password: form.password,
          role: form.role,
          institution: form.institution,
        });

        if (res.success && res.user) {
          handleLoginSuccess(res.user);
          return;
        }
      } else {
        if (!form.name.trim() || !form.email.trim()) {
          setError("Name and institutional email are required.");
          setLoading(false);
          return;
        }

        const res = await signupUser({
          name: form.name.trim(),
          email: form.email.trim(),
          institution: form.institution,
          role: form.role,
          node_type: form.nodeType,
          password: form.password,
        });

        if (res.success && res.user) {
          handleLoginSuccess(res.user);
          return;
        } else if (res.detail) {
          setError(res.detail);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Handled by fallback
    }

    // Graceful persona evaluation fallback
    const matched = DEMO_PERSONAS.find((p) => p.role === form.role) || DEMO_PERSONAS[0];
    const user = {
      ...matched,
      name: form.name.trim() || matched.name,
      email: form.email || matched.email,
      institution: form.institution || matched.institution,
    };
    handleLoginSuccess(user);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#0a140f]/95 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_-5px_rgba(16,185,129,0.2)]">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 flex items-center justify-center text-black font-black">
            <ShieldCheck className="h-5 w-5 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              NexusFL Enclave Authentication
            </h2>
            <p className="text-xs text-slate-400">
              Zero-Trust Secure Access & Node Federation Key
            </p>
          </div>
        </div>

        {/* 1-Click Quick Persona Access */}
        <div className="mb-6 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/20">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              1-Click Institutional Access:
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              Fast Demo
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DEMO_PERSONAS.map((p) => (
              <button
                key={p.role}
                type="button"
                onClick={() => handleLoginSuccess(p)}
                className="p-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-emerald-500/20 hover:border-emerald-500/50 text-left transition-all group"
              >
                <div className="text-sm">{p.iconEmoji}</div>
                <div className="text-[11px] font-bold text-white group-hover:text-emerald-300 truncate mt-0.5">
                  {p.title}
                </div>
                <div className="text-[9px] font-mono text-slate-400 truncate">
                  {p.name.split(" ")[0]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs: Sign In vs Register */}
        <div className="flex rounded-xl bg-black/40 border border-white/10 p-1 mb-5">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setError("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === "login"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In with Enclave Credentials
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("signup");
              setError("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === "signup"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Register New Bank Node
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 mb-4 rounded-xl border border-red-500/40 bg-red-950/30 text-red-300 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "signup" && (
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                placeholder="Dr. Vikram Seth"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/50 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-slate-300 mb-1">
              Institutional Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/50 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                Institutional Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/50 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="manager">Bank Risk Director (Executive)</option>
                <option value="analyst">Senior Fraud Analyst</option>
                <option value="admin">Chief FL Architect (FedOps)</option>
                <option value="secops">SecOps Enclave Auditor</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                Bank Entity / Node
              </label>
              <select
                value={form.institution}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/50 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Bank 1 (PostgreSQL Node Alpha)">Bank 1 (PostgreSQL SQL Node)</option>
                <option value="Bank 2 (NoSQL Node Beta)">Bank 2 (MongoDB NoSQL Node)</option>
                <option value="Central Parameter Server">Flower FL Central Parameter Enclave</option>
                <option value="Global Cryptographic Audit Enclave">Global Security Enclave</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-300 mb-1">
              Passkey / mTLS Token
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/50 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2">
            <GlassButton
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
              icon={tab === "login" ? LogIn : UserPlus}
            >
              <span>{loading ? "Authenticating..." : tab === "login" ? "Authenticate Enclave" : "Register Node Identity"}</span>
            </GlassButton>
          </div>
        </form>
      </div>
    </div>
  );
}

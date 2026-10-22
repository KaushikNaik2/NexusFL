"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { DEMO_PERSONAS, INITIAL_TRANSACTIONS } from "../lib/constants";
import { checkHealth, predictTransaction, submitAlertAudit, generateCanonicalTensor } from "../lib/api";

const AppContext = createContext(null);

const MERCHANT_NAMES_NORMAL = [
  "Whole Foods Market #104",
  "Apple Store 5th Ave",
  "Shell Fuel Express #402",
  "Starbucks Coffee #928",
  "Amazon Prime Marketplace",
  "Uber Technologies Trip",
  "Target Store #8491",
  "Delta Air Lines Ticket",
];

const MERCHANT_NAMES_RISK = [
  "Luxe Timepieces Geneva",
  "Crypto OTC Exchange Dubai",
  "High-Value Electronics HK",
  "Grand Casino Monaco Web",
  "Private Jet Charter Miami",
  "Offshore Vault Transfer SG",
];

export function AppProvider({ children }) {
  // Navigation & View Mode
  const [currentView, setCurrentView] = useState("welcome"); // "welcome" | "dashboard"
  const [authModal, setAuthModal] = useState(null); // null | "login" | "signup"
  const [activeRole, setActiveRole] = useState("manager"); // "manager" | "admin" | "analyst" | "secops"

  // User Authentication
  const [currentUser, setCurrentUser] = useState(DEMO_PERSONAS[0]);

  // Analyst Ingestion Stream
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [selectedTx, setSelectedTx] = useState(INITIAL_TRANSACTIONS[0]);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);

  // Health and System Telemetry
  const [apiStatus, setApiStatus] = useState({
    connected: false,
    framework: "Checking...",
    device: "cpu",
    latency: 0,
  });
  const [currentTime, setCurrentTime] = useState("");
  const [auditNotice, setAuditNotice] = useState(null);

  // SecOps Integrity Controls
  const [nodeTokens, setNodeTokens] = useState({ bank1: "REVOKED_NO", bank2: "REVOKED_NO" });
  const [freezeEdgeSync, setFreezeEdgeSync] = useState(false);

  // Real-time Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toUTCString().slice(17, 25) + " UTC");
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Backend Health Polling
  useEffect(() => {
    let isSubscribed = true;
    const runHealthCheck = async () => {
      const status = await checkHealth();
      if (isSubscribed) setApiStatus(status);
    };

    runHealthCheck();
    const interval = setInterval(runHealthCheck, 8000);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, []);

  // Execution of Inference (Real API or local fallback)
  const executeInference = useCallback(async (bankId, isHighRisk) => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const txId = `TX-${bankId === "bank_1" ? "B1" : "B2"}-${randomSuffix}`;
    const now = new Date().toLocaleTimeString();

    const { features, amount, pcaHighlights } = generateCanonicalTensor(isHighRisk);

    const result = await predictTransaction({
      features,
      transactionId: txId,
      bankId,
      isHighRisk,
    });

    const merchantList = isHighRisk ? MERCHANT_NAMES_RISK : MERCHANT_NAMES_NORMAL;
    const merchant = merchantList[Math.floor(Math.random() * merchantList.length)];

    const newTx = {
      id: result.id,
      cardNumber: `${4000 + Math.floor(Math.random() * 1500)} •••• •••• ${randomSuffix % 10000}`,
      cardHolder: isHighRisk ? "UNVERIFIED ENCLAVE CLIENT" : "VERIFIED CUSTOMER",
      cardType: isHighRisk ? "Corporate Black" : "Emerald Preferred",
      merchant,
      bank: bankId === "bank_1" ? "Bank 1 (Relational SQL)" : "Bank 2 (NoSQL JSON)",
      bankShort: bankId === "bank_1" ? "Bank 1" : "Bank 2",
      time: now,
      amount,
      probability: result.probability,
      is_fraud: result.is_fraud,
      pcaHighlights,
      latencyMs: result.latencyMs,
      status: result.is_fraud ? "CRITICAL_ALERT" : "APPROVED",
      location: isHighRisk ? "High-Risk Geolocation" : "Domestic POS Enclave",
    };

    setTransactions((prev) => [newTx, ...prev.slice(0, 49)]);
    if (newTx.is_fraud) {
      setSelectedTx(newTx);
    }
    return newTx;
  }, []);

  // Live Auto-Streamer
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      const isHighRisk = Math.random() < 0.28;
      const bank = Math.random() < 0.5 ? "bank_1" : "bank_2";
      executeInference(bank, isHighRisk);
    }, 2800);
    return () => clearInterval(interval);
  }, [isLiveStreaming, executeInference]);

  // Analyst Action Handlers
  const handleConfirmFraud = useCallback(async (tx) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === tx.id ? { ...t, status: "CONFIRMED_FRAUD" } : t))
    );
    setSelectedTx((prev) => (prev?.id === tx.id ? { ...prev, status: "CONFIRMED_FRAUD" } : prev));
    await submitAlertAudit(tx.id, "CONFIRMED_FRAUD", "Interdicted by Fraud Operations. Card frozen.");
    setAuditNotice(`Transaction ${tx.id} confirmed as FRAUD. Edge bank node notified.`);
    setTimeout(() => setAuditNotice(null), 4500);
  }, []);

  const handleOverrideFalsePositive = useCallback(async (tx) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === tx.id ? { ...t, status: "FALSE_POSITIVE" } : t))
    );
    setSelectedTx((prev) => (prev?.id === tx.id ? { ...prev, status: "FALSE_POSITIVE" } : prev));
    await submitAlertAudit(tx.id, "FALSE_POSITIVE", "Manual operational override by security analyst.");
    setAuditNotice(`Transaction ${tx.id} marked FALSE POSITIVE. Model override logged.`);
    setTimeout(() => setAuditNotice(null), 4500);
  }, []);

  // Authentication Handlers
  const handleLoginSuccess = useCallback((user) => {
    setCurrentUser(user);
    if (user.role) {
      setActiveRole(user.role);
    }
    setAuthModal(null);
    setCurrentView("dashboard");
    setAuditNotice(`Enclave Authenticated: ${user.name} logged in as ${user.title || user.role.toUpperCase()}`);
    setTimeout(() => setAuditNotice(null), 5000);
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentView("welcome");
    setAuditNotice("Enclave session terminated. Returned to public gateway.");
    setTimeout(() => setAuditNotice(null), 4000);
  }, []);

  const openAuthModal = useCallback((mode = "login") => {
    setAuthModal(mode);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModal(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      currentView,
      setCurrentView,
      authModal,
      openAuthModal,
      closeAuthModal,
      activeRole,
      setActiveRole,
      currentUser,
      transactions,
      selectedTx,
      setSelectedTx,
      isLiveStreaming,
      setIsLiveStreaming,
      apiStatus,
      currentTime,
      auditNotice,
      nodeTokens,
      setNodeTokens,
      freezeEdgeSync,
      setFreezeEdgeSync,
      executeInference,
      handleConfirmFraud,
      handleOverrideFalsePositive,
      handleLoginSuccess,
      handleLogout,
    }),
    [
      currentView,
      authModal,
      openAuthModal,
      closeAuthModal,
      activeRole,
      currentUser,
      transactions,
      selectedTx,
      isLiveStreaming,
      apiStatus,
      currentTime,
      auditNotice,
      nodeTokens,
      freezeEdgeSync,
      executeInference,
      handleConfirmFraud,
      handleOverrideFalsePositive,
      handleLoginSuccess,
      handleLogout,
    ]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

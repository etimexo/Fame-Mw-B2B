"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  ShieldAlert,
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  Send,
  Upload,
  User,
  ShieldCheck,
  ChevronRight,
  DollarSign,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { Dispute, DisputeStatus } from "@/types";
import { formatNaira, formatDateTime } from "@/lib/utils";

export default function DisputeBoard() {
  const { disputes, respondToDispute, sendDisputeMessage } = useDashboard();

  const [selectedDisputeId, setSelectedDisputeId] = useState<string>(
    disputes[0]?.id || ""
  );
  const [chatInput, setChatInput] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const activeDispute = disputes.find((d) => d.id === selectedDisputeId) || disputes[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeDispute) return;
    sendDisputeMessage(activeDispute.id, chatInput.trim());
    setChatInput("");
  };

  const handleAction = (action: "accepted" | "refunded") => {
    if (!activeDispute) return;
    const reason =
      action === "accepted"
        ? "Merchant accepted return/replacement under FameMe 7-day guarantee."
        : "Merchant issued a full instant refund from escrow.";
    respondToDispute(activeDispute.id, action, reason);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim() || !activeDispute) return;
    respondToDispute(activeDispute.id, "rejected", rejectReason.trim());
    setShowRejectModal(false);
    setRejectReason("");
  };

  const getStatusBadge = (status: DisputeStatus) => {
    switch (status) {
      case "open":
        return { label: "Open Case", class: "bg-[#E7000B]/15 text-[#E7000B] border-[#E7000B]/30" };
      case "under_review":
        return { label: "Under Review", class: "bg-[#E7DFA6]/40 text-[#605510] border-[#E7DFA6]/60" };
      case "resolved":
        return { label: "Resolved", class: "bg-[#15803D]/15 text-[#15803D] border-[#15803D]/30" };
      case "escalated":
        return { label: "Arbitration Escalated", class: "bg-[#E72A52]/15 text-[#B12642] border-[#E72A52]/30" };
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Returns, Complaints & Dispute Resolution Center
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Fame & Me merchant arbitration board. Escrow funds remain locked until resolution.
        </p>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Cases List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">
                Dispute Cases ({disputes.length})
              </span>
              <span className="text-[11px] text-slate-500">
                {disputes.filter((d) => d.status === "open").length} require response
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {disputes.map((d) => {
                const isSelected = d.id === activeDispute?.id;
                const badge = getStatusBadge(d.status);

                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDisputeId(d.id)}
                    className={`rounded-xl border p-3.5 cursor-pointer transition-standard ${
                      isSelected
                        ? "border-[#E72A52] bg-[#E72A52]/10/40 shadow-xs"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {d.caseNumber}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.2 text-[10px] font-bold ${badge.class}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <div className="mt-2 text-xs font-bold text-slate-800">
                      {d.customerName}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      Order #{d.orderNumber} • Reason: {d.reason}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-slate-900">
                        Locked: {formatNaira(d.amount)}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {formatDateTime(d.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Case Resolution & Arbitration Console */}
        <div className="lg:col-span-7 space-y-5">
          {activeDispute ? (
            <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white shadow-xs overflow-hidden">
              {/* Case Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900">
                        {activeDispute.caseNumber}
                      </h2>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                          getStatusBadge(activeDispute.status).class
                        }`}
                      >
                        {getStatusBadge(activeDispute.status).label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Relates to Order #{activeDispute.orderNumber} • Customer: {activeDispute.customerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Escrow Held
                    </span>
                    <span className="font-mono text-base font-black text-rose-600">
                      {formatNaira(activeDispute.amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Case Details & Customer Evidence */}
              <div className="p-5 space-y-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Customer Complaint & Claim Category
                  </span>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800">
                    <div className="font-bold text-slate-900 mb-1">
                      Category: {activeDispute.category.replace(/_/g, " ").toUpperCase()}
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {activeDispute.customerEvidence.description}
                    </p>
                  </div>
                </div>

                {/* Photo Evidence */}
                {activeDispute.customerEvidence.photos.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Attached Customer Photos / Proof
                    </span>
                    <div className="flex gap-3">
                      {activeDispute.customerEvidence.photos.map((photo, i) => (
                        <div key={i} className="relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo}
                            alt="Dispute evidence"
                            className="h-24 w-24 rounded-xl object-cover ring-1 ring-slate-200 shadow-2xs"
                          />
                          <a
                            href={photo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-slate-900/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity"
                          >
                            Expand
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Merchant Response Status Banner */}
                {activeDispute.merchantResponse && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900">
                    <span className="font-bold block">
                      Merchant Response Dispatched ({activeDispute.merchantResponse.action.toUpperCase()}):
                    </span>
                    <p className="mt-0.5 text-emerald-800">
                      {activeDispute.merchantResponse.reason}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons for Merchant */}
              {activeDispute.status !== "resolved" && (
                <div className="p-5 border-b border-slate-100 bg-slate-50/40">
                  <span className="text-xs font-bold text-slate-900 block mb-2">
                    Merchant Action Center
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => handleAction("accepted")}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-standard"
                    >
                      <CheckCircle className="h-4 w-4" /> Accept Return / Swap
                    </button>

                    <button
                      onClick={() => handleAction("refunded")}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-[#E72A52] hover:bg-[#B12642] py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-standard"
                    >
                      <DollarSign className="h-4 w-4" /> Approve Full Refund
                    </button>

                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 py-2.5 px-3 text-xs font-bold text-rose-700 shadow-2xs transition-standard"
                    >
                      <XCircle className="h-4 w-4" /> Reject Claim
                    </button>
                  </div>
                </div>
              )}

              {/* Live Arbitration Chat Thread */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-[#E72A52]" />
                    Three-Way Arbitration Thread (Seller • Customer • FameMe Arbitrator)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Transcripts recorded for platform audits
                  </span>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {activeDispute.messages.map((m) => {
                    const isMerchant = m.sender === "merchant";
                    const isArbitrator = m.sender === "arbitrator";

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col text-xs ${
                          isMerchant
                            ? "items-end"
                            : isArbitrator
                            ? "items-center"
                            : "items-start"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                          {isArbitrator && <ShieldCheck className="h-3 w-3 text-[#E72A52]" />}
                          <span className="font-semibold text-slate-700">{m.senderName}</span>
                          <span>• {formatDateTime(m.timestamp)}</span>
                        </div>
                        <div
                          className={`rounded-2xl px-4 py-2.5 max-w-md ${
                            isMerchant
                              ? "bg-[#E72A52] text-white rounded-br-xs"
                              : isArbitrator
                              ? "bg-purple-100 text-purple-900 border border-purple-200 text-center font-medium"
                              : "bg-slate-100 text-slate-800 rounded-bl-xs"
                          }`}
                        >
                          {m.message}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Send chat message */}
                <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type official merchant response or offer compromise..."
                    className="flex-1 h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                  />
                  <button
                    type="submit"
                    className="flex h-10 items-center justify-center gap-1 rounded-xl bg-[#E72A52] hover:bg-[#B12642] px-4 text-xs font-bold text-white shadow-xs transition-standard shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" /> Send
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-12 text-center text-slate-500">
              <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No Active Disputes</p>
              <p className="text-xs text-slate-400 mt-1">
                Your store currently has zero open returns or buyer complaints.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-[#CCCCCC]/40 bg-white shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-sm font-bold text-slate-900">
                Reject Return Claim with Mandatory Explanation
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Per FameMe B2B Vendor Code of Conduct, you must provide a factual explanation for rejecting the buyer&apos;s request. This will be reviewed by the platform arbitrator.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <textarea
                required
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="State clearly why the claim is invalid (e.g. proof of courier delivery signature, package tamper seals broken by customer, digital asset verified downloaded with valid checksums)..."
                className="w-full p-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-bold text-white shadow-xs"
                >
                  Submit Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

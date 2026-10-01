"use client";

import React, { useState } from "react";
import {
  LifeBuoy,
  Plus,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  Send,
  Phone,
  Mail,
  ShieldCheck,
  FileQuestion,
  ChevronDown,
  X,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { SupportTicket } from "@/types";
import { formatDateTime } from "@/lib/utils";

export default function SupportView() {
  const { supportTickets, openSupportTicket, sendTicketMessage } = useDashboard();

  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    supportTickets[0]?.id || ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<SupportTicket["category"]>("orders_shipping");
  const [priority, setPriority] = useState<SupportTicket["priority"]>("medium");
  const [initialMessage, setInitialMessage] = useState("");
  const [ticketReply, setTicketReply] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const activeTicket =
    supportTickets.find((t) => t.id === selectedTicketId) || supportTickets[0];

  const handleOpenTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !initialMessage.trim()) return;

    openSupportTicket(subject, category, priority, initialMessage);
    setIsModalOpen(false);
    setSubject("");
    setInitialMessage("");
    setToastMessage("Support ticket opened! Merchant relations team notified.");
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketReply.trim() || !activeTicket) return;

    sendTicketMessage(activeTicket.id, ticketReply.trim());
    setTicketReply("");
  };

  const faqs = [
    {
      q: "What is the settlement schedule for Nigerian bank transfers?",
      a: "Withdrawals are disbursed via NIBSS Instant Payments within 15–30 minutes once escrow conditions are met (courier delivery receipt + 7-day dispute window).",
    },
    {
      q: "How are courier waybills generated for GIG Logistics and DHL?",
      a: "Click 'Print Waybill' on any order in 'Ready for Dispatch' state. The system auto-generates a standardized airway bill with barcodes, fragile notices, and your sender warehouse details.",
    },
    {
      q: "How does Fame & Me handle digital asset audio stems piracy?",
      a: "Every stem pack download generates a unique cryptographic token valid for a limited download count. Unused or corrupted links can be re-issued instantly from your Order Detail drawer.",
    },
    {
      q: "How can I upgrade from Creator Pro (12%) to Corporate Tier 1 (8%)?",
      a: "Submit your CAC Certificate of Incorporation and TIN Tax clearance in Settings > Profile. Once verified by our legal team, your take-rate drops automatically.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Merchant Help Desk & Dedicated Relations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            24/7 dedicated assistance for courier waybill logistics, escrow payout inquiries, and platform policy.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#E72A52] to-[#B12642] hover:opacity-95 px-5 py-2.5 font-black text-xs font-bold text-white shadow-xs transition-standard"
        >
          <Plus className="h-4 w-4" /> Open Support Ticket
        </button>
      </div>

      {toastMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Support hotline cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-4 shadow-xs flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E72A52]/10 text-[#E72A52]">
            <Phone className="h-5 w-5" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">Merchant Hotline</span>
            <span className="font-mono text-slate-600">+234 (0) 1 888 3263</span>
            <span className="text-[10px] text-emerald-600 font-semibold block">Mon-Sat 8am-8pm</span>
          </div>
        </div>

        <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-4 shadow-xs flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#82C7EF]/15 text-[#E72A52]">
            <Mail className="h-5 w-5" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">Partner Relations</span>
            <span className="text-slate-600">partners@fameme.ng</span>
            <span className="text-[10px] text-slate-400 block">&lt; 2 hour SLA response</span>
          </div>
        </div>

        <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-4 shadow-xs flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">Dispute Arbitration</span>
            <span className="text-slate-600">disputes@fameme.ng</span>
            <span className="text-[10px] text-slate-400 block">Escrow protection team</span>
          </div>
        </div>
      </div>

      {/* Tickets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Tickets List (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-[#CCCCCC]/40 bg-white p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900">
              Active Support Cases ({supportTickets.length})
            </span>
            <span className="text-[11px] text-slate-400">Track inquiries</span>
          </div>

          <div className="space-y-2">
            {supportTickets.map((t) => {
              const isSelected = t.id === activeTicket?.id;

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`rounded-xl border p-3.5 cursor-pointer transition-standard ${
                    isSelected
                      ? "border-[#E72A52] bg-[#E72A52]/10/40 shadow-xs"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {t.ticketNumber}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[10px] font-bold uppercase ${
                        t.status === "open"
                          ? "bg-blue-100 text-blue-700"
                          : t.status === "closed"
                          ? "bg-slate-100 text-slate-600"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {t.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="font-bold text-slate-800 text-xs mt-1.5 line-clamp-1">
                    {t.subject}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="capitalize">{t.category.replace("_", " ")}</span>
                    <span>{formatDateTime(t.updatedAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ticket Chat & Details (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-[#CCCCCC]/40 bg-white shadow-xs overflow-hidden">
          {activeTicket ? (
            <div>
              <div className="p-5 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#B12642]">
                      {activeTicket.ticketNumber}
                    </span>
                    <h2 className="text-sm font-bold text-slate-900 mt-0.5">
                      {activeTicket.subject}
                    </h2>
                    <span className="text-[10px] text-slate-400">
                      Category: {activeTicket.category.replace("_", " ").toUpperCase()} • Priority: {activeTicket.priority.toUpperCase()}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      activeTicket.status === "open"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {activeTicket.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="p-5 space-y-4 max-h-80 overflow-y-auto">
                {activeTicket.messages.map((m, idx) => {
                  const isMerchant = m.sender === "merchant";

                  return (
                    <div
                      key={idx}
                      className={`flex flex-col text-xs ${
                        isMerchant ? "items-end" : "items-start"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-700">{m.name}</span>
                        <span>• {formatDateTime(m.timestamp)}</span>
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-2.5 max-w-md ${
                          isMerchant
                            ? "bg-[#E72A52] text-white rounded-br-xs"
                            : "bg-slate-100 text-slate-800 rounded-bl-xs"
                        }`}
                      >
                        {m.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Send message form */}
              {activeTicket.status !== "closed" && (
                <form onSubmit={handleSendReply} className="p-4 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    value={ticketReply}
                    onChange={(e) => setTicketReply(e.target.value)}
                    placeholder="Type reply to Fame & Me Merchant Support..."
                    className="flex-1 h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                  />
                  <button
                    type="submit"
                    className="flex h-10 items-center justify-center gap-1 rounded-xl bg-[#E72A52] hover:bg-[#B12642] px-4 text-xs font-bold text-white shadow-xs transition-standard shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" /> Send
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Select a Ticket</p>
            </div>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="h-5 w-5 text-[#E72A52]" />
          <h3 className="text-sm font-bold text-slate-900">
            Frequently Asked Merchant Questions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900">{f.q}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Open Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-[#CCCCCC]/40 bg-white shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Open New Support Ticket</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleOpenTicket} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Courier GIG pickup delayed for Lekki branch"
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SupportTicket["category"])}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                  >
                    <option value="orders_shipping">Orders & Logistics</option>
                    <option value="payouts_finance">Finance & Payouts</option>
                    <option value="kyc_account">KYC & Verification</option>
                    <option value="disputes">Disputes & Returns</option>
                    <option value="technical">Technical & API</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as SupportTicket["priority"])}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Message Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  placeholder="Describe your inquiry with order IDs or waybill references..."
                  className="w-full p-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-[#E72A52] to-[#B12642] hover:opacity-95 px-5 py-2.5 font-black text-xs font-bold text-white shadow-xs"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

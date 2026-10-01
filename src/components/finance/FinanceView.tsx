"use client";

import React, { useState } from "react";
import {
  Wallet,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Download,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Info,
  DollarSign,
  Receipt,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { formatNaira, formatDateTime, formatDate } from "@/lib/utils";
import PayoutModal from "./PayoutModal";

export default function FinanceView() {
  const { balances, payouts, profile, orders } = useDashboard();
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  // Escrow orders breakdown
  const escrowOrders = orders.filter(
    (o) =>
      o.status === "processing" ||
      o.status === "awaiting_fulfillment" ||
      o.status === "ready_for_dispatch" ||
      o.status === "shipped" ||
      (o.status === "delivered" && o.hasDispute)
  );

  const handleExportCSV = () => {
    // Generate CSV string
    const headers = "Batch ID,Date,Bank,Account,Amount (NGN),Fee (NGN),Net Amount,Status\n";
    const rows = payouts
      .map(
        (p) =>
          `"${p.batchId}","${p.requestedAt}","${p.bankName}","${p.accountNumber}",${p.amount},${p.fee},${p.netAmount},"${p.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fameme-payout-statement-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Financial Ledger & Escrow Settlement Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent escrow releases, verified Nigerian bank payouts, and fee reconciliations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs transition-standard"
          >
            <Download className="h-4 w-4 text-slate-500" /> Export Statement (CSV)
          </button>
          <button
            onClick={() => setIsPayoutModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#E72A52] to-[#B12642] hover:opacity-95 px-5 py-2.5 text-xs font-black text-white shadow-sm transition-standard"
          >
            <Wallet className="h-4 w-4" /> Request Payout
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Financial statement CSV downloaded successfully!</span>
        </div>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {/* Available Balance */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-800">
            <span>Available to Withdraw</span>
            <Wallet className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-950 mt-3 tracking-tight">
            {formatNaira(balances.availableWithdrawable)}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-700 pt-2 border-t border-emerald-100">
            <span>Settled funds ready</span>
            <button
              onClick={() => setIsPayoutModalOpen(true)}
              className="font-bold underline hover:text-emerald-900"
            >
              Withdraw Now →
            </button>
          </div>
        </div>

        {/* Pending Escrow Balance */}
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/60 to-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-800">
            <span>Pending Escrow Balance</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-950 mt-3 tracking-tight">
            {formatNaira(balances.pendingEscrow)}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-amber-800 pt-2 border-t border-amber-100">
            <span>{escrowOrders.length} orders in transit/window</span>
            <span className="font-semibold">7-Day Guarantee</span>
          </div>
        </div>

        {/* Lifetime Gross */}
        <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Lifetime Gross Sales</span>
            <ArrowUpRight className="h-4 w-4 text-[#E72A52]" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-3 tracking-tight">
            {formatNaira(balances.lifetimeGross)}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Cumulative marketplace volume</span>
            <span className="text-emerald-600 font-bold">Tier Verified</span>
          </div>
        </div>

        {/* Total Platform Deductions */}
        <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>FameMe Platform Fees</span>
            <Receipt className="h-4 w-4 text-[#E72A52]" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-3 tracking-tight">
            {formatNaira(balances.totalCommissionPaid)}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Take-rate: {(profile.commissionRate * 100).toFixed(0)}%</span>
            <span>Gateway fees included</span>
          </div>
        </div>
      </div>

      {/* Escrow Mechanism Explanation Card */}
      <div className="rounded-2xl border border-[#CCCCCC]/40 bg-gradient-to-r from-[#E7DFA6]/20/80 via-white to-[#82C7EF]/15/80 p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E72A52] text-white">
            <Info className="h-5 w-5" />
          </div>
          <div className="flex-1 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">
              How Fame & Me Escrow Protection Protects Both Sellers & Buyers
            </h3>
            <p className="text-slate-600 mt-1 leading-relaxed">
              When a buyer purchases merchandise or stems, funds are captured immediately in a dedicated marketplace trust account. For physical products, funds stay locked until confirmed courier delivery (via GIG, DHL, or Kwik) + a <strong>7-day dispute window</strong>. If no claim is lodged, funds unlock into your Withdrawable Balance automatically. Digital stems with instant download unlock within 24 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Bank Withdrawal & Settlement Batches
            </h3>
            <p className="text-xs text-slate-500">
              Audit log of all requested bank disbursements via NIBSS Instant Payments.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-700">
            {payouts.length} Recorded Settlements
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 pl-4">Batch ID & Reference</th>
                <th className="py-3.5">Requested At</th>
                <th className="py-3.5">Destination Bank</th>
                <th className="py-3.5">Gross Amount</th>
                <th className="py-3.5">Fee</th>
                <th className="py-3.5">Net Credit</th>
                <th className="py-3.5 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-standard">
                  <td className="py-3.5 pl-4">
                    <div className="font-mono font-bold text-slate-900">{p.batchId}</div>
                    <div className="text-[10px] font-mono text-slate-400">{p.reference}</div>
                  </td>

                  <td className="py-3.5 text-slate-600">
                    <div>{formatDate(p.requestedAt)}</div>
                    <div className="text-[10px] text-slate-400">
                      {p.settledAt ? `Settled ${formatDate(p.settledAt)}` : "Pending NIBSS Ack"}
                    </div>
                  </td>

                  <td className="py-3.5">
                    <div className="font-semibold text-slate-900">{p.bankName}</div>
                    <div className="text-[11px] font-mono text-slate-500">
                      {p.accountNumber} ({p.accountName})
                    </div>
                  </td>

                  <td className="py-3.5 font-mono font-bold text-slate-900">
                    {formatNaira(p.amount)}
                  </td>

                  <td className="py-3.5 font-mono text-slate-500">
                    {formatNaira(p.fee)}
                  </td>

                  <td className="py-3.5 font-mono font-bold text-emerald-700">
                    {formatNaira(p.netAmount)}
                  </td>

                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                        p.status === "settled"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : p.status === "processing"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Modal */}
      <PayoutModal isOpen={isPayoutModalOpen} onClose={() => setIsPayoutModalOpen(false)} />
    </div>
  );
}

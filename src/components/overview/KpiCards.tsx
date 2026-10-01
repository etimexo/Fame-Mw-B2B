"use client";

import React from "react";
import {
  TrendingUp,
  Package,
  Wallet,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Truck,
  ShieldAlert,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { formatNaira } from "@/lib/utils";
import Link from "next/link";

export default function KpiCards() {
  const { orders, products, disputes, balances } = useDashboard();

  // 1. Gross Sales
  const mtdGross = balances.lifetimeGross;

  // 2. Orders Split
  const awaitingAction = orders.filter(
    (o) => o.status === "new" || o.status === "processing" || o.status === "awaiting_fulfillment"
  ).length;
  const inTransit = orders.filter((o) => o.status === "shipped").length;
  const totalOrdersCount = orders.length;

  // 3. Balance & Escrow
  const availableBal = balances.availableWithdrawable;
  const escrowBal = balances.pendingEscrow;

  // 4. Active Alerts
  const lowStockCount = products.filter(
    (p) => p.type === "physical" && p.stock <= p.lowStockThreshold
  ).length;
  const openDisputesCount = disputes.filter((d) => d.status === "open").length;
  const totalAlerts = lowStockCount + openDisputesCount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
      {/* Card 1: Gross Sales (Che Guevara Red Theme) */}
      <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-6 shadow-sm hover:shadow-md transition-standard group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Gross Sales (MTD)
          </span>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E72A52]/10 text-[#E72A52] group-hover:scale-105 transition-standard">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl sm:text-3xl font-black text-[#111111] font-mono tracking-tight">
            {formatNaira(mtdGross)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="inline-flex items-center font-extrabold text-[#15803D] bg-[#15803D]/10 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +24.8%
            </span>
            <span className="text-slate-400 font-medium">vs last month</span>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Today: <strong className="text-[#111111] font-mono font-bold">₦72,500</strong></span>
          <span>Week: <strong className="text-[#111111] font-mono font-bold">₦486,000</strong></span>
        </div>
      </div>

      {/* Card 2: Total Orders (Light Sky Blue Theme) */}
      <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-6 shadow-sm hover:shadow-md transition-standard group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Orders Pipeline
          </span>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#82C7EF]/20 text-[#12597f] group-hover:scale-105 transition-standard">
            <Package className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl sm:text-3xl font-black text-[#111111] font-mono tracking-tight">
            {totalOrdersCount} <span className="text-sm font-semibold text-slate-400">Total</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
            <span className="inline-flex items-center gap-1 font-bold text-[#12597f] bg-[#82C7EF]/20 px-2 py-0.5 rounded-full border border-[#82C7EF]/30">
              <Truck className="h-3 w-3" /> {inTransit} Transit
            </span>
            <span className="inline-flex items-center gap-1 font-bold text-[#62540f] bg-[#E7DFA6]/40 px-2 py-0.5 rounded-full border border-[#E7DFA6]/60">
              <Clock className="h-3 w-3" /> {awaitingAction} Action
            </span>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">SLA Guarantee:</span>
          <span className="font-black text-[#15803D]">98.2% on-time</span>
        </div>
      </div>

      {/* Card 3: Available Balance (Pharmaceutical Green & Serpent Sceptre) */}
      <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-6 shadow-sm hover:shadow-md transition-standard group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Settlement Balance
          </span>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#15803D]/10 text-[#15803D] group-hover:scale-105 transition-standard">
            <Wallet className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl sm:text-3xl font-black text-[#15803D] font-mono tracking-tight">
            {formatNaira(availableBal)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="font-semibold text-slate-500">Ready for direct payout</span>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-[#BCD025]" /> Escrow:
          </span>
          <strong className="text-[#111111] font-mono font-bold">
            {formatNaira(escrowBal)}
          </strong>
        </div>
      </div>

      {/* Card 4: Active Alerts (Miyamoto Red & Beige Accent) */}
      <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-6 shadow-sm hover:shadow-md transition-standard group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Active Alerts
          </span>
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-standard group-hover:scale-105 ${
              totalAlerts > 0 ? "bg-[#E7000B]/10 text-[#E7000B]" : "bg-slate-100 text-slate-400"
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl sm:text-3xl font-black text-[#111111] font-mono tracking-tight">
            {totalAlerts}{" "}
            <span className="text-sm font-semibold text-slate-400">Flagged</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
            <span className="inline-flex items-center gap-1 font-bold text-[#62540f] bg-[#E7DFA6]/40 px-2 py-0.5 rounded-full border border-[#E7DFA6]/60">
              {lowStockCount} Low Stock
            </span>
            <span className="inline-flex items-center gap-1 font-bold text-[#B12642] bg-[#E72A52]/15 px-2 py-0.5 rounded-full border border-[#E72A52]/30">
              {openDisputesCount} Disputes
            </span>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link href="/inventory" className="text-[#E72A52] font-black hover:underline">
            Inventory →
          </Link>
          <Link href="/disputes" className="text-[#B12642] font-black hover:underline">
            Disputes →
          </Link>
        </div>
      </div>
    </div>
  );
}

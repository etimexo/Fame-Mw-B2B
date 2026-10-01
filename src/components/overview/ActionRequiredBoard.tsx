"use client";

import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  Package,
  ShieldAlert,
  ArrowRight,
  Boxes,
  FileCheck,
  CheckCircle,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { formatNaira } from "@/lib/utils";

export default function ActionRequiredBoard() {
  const { orders, disputes, products } = useDashboard();

  // 1. Orders approaching SLA
  const slaOrders = orders.filter((o) => o.status === "awaiting_fulfillment");

  // 2. Open Disputes
  const openDisputes = disputes.filter((d) => d.status === "open" || d.status === "under_review");

  // 3. Products pending admin approval
  const pendingProducts = products.filter((p) => p.approvalStatus === "under_review");

  // 4. Low/Out of stock items
  const urgentStock = products.filter(
    (p) => p.type === "physical" && p.stock <= p.lowStockThreshold
  );

  const totalActions = slaOrders.length + openDisputes.length + pendingProducts.length + urgentStock.length;

  return (
    <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-6 sm:p-7 shadow-sm">
      <div className="flex items-center justify-between pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7000B]/10 text-[#E7000B]">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#111111]">
              Action Required Board
            </h3>
            <p className="text-xs text-slate-500">
              Prioritized merchant operational tasks and compliance gates.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-[#E72A52]/10 border border-[#E72A52]/20 px-3 py-1 text-xs font-black text-[#E72A52]">
          {totalActions} Pending
        </span>
      </div>

      <div className="mt-5 space-y-3.5">
        {/* SLA Orders */}
        {slaOrders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#E7000B]/30 bg-[#E7000B]/5 p-4 transition-standard hover:bg-[#E7000B]/10"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E7000B] text-white shadow-xs">
                <Clock className="h-4 w-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#111111]">
                    Fulfill #{order.orderNumber}
                  </span>
                  <span className="rounded-md bg-[#E7000B] text-white px-1.5 py-0.2 text-[9px] font-black uppercase">
                    SLA CRITICAL
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Customer: <strong>{order.customerName}</strong> ({order.shippingAddress.city}) • {formatNaira(order.subtotal + order.shippingFee)}
                </p>
              </div>
            </div>
            <Link
              href="/orders"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#111111] hover:bg-[#E72A52] text-white px-3.5 py-2 text-xs font-black shrink-0 transition-standard shadow-xs"
            >
              Dispatch <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ))}

        {/* Open Disputes */}
        {openDisputes.map((dispute) => (
          <div
            key={dispute.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#E72A52]/30 bg-[#E72A52]/5 p-4 transition-standard hover:bg-[#E72A52]/10"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E72A52] text-white shadow-xs">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#111111]">
                    Dispute #{dispute.caseNumber}
                  </span>
                  <span className="rounded-md bg-[#E72A52] text-white px-1.5 py-0.2 text-[9px] font-black uppercase">
                    {dispute.category.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Reason: {dispute.reason.slice(0, 50)}... ({formatNaira(dispute.amount)})
                </p>
              </div>
            </div>
            <Link
              href="/disputes"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#E72A52] hover:bg-[#B12642] text-white px-3.5 py-2 text-xs font-black shrink-0 transition-standard shadow-xs"
            >
              Resolve <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ))}

        {/* Low Stock Items */}
        {urgentStock.slice(0, 2).map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#E7DFA6] bg-[#E7DFA6]/20 p-4 transition-standard hover:bg-[#E7DFA6]/30"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5d5418] text-white">
                <Boxes className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-black text-[#111111]">
                  Low Inventory: {item.title}
                </span>
                <p className="text-[11px] text-slate-600 mt-1">
                  Only <strong className="text-[#E7000B] font-bold">{item.stock} units left</strong> (Threshold: {item.lowStockThreshold})
                </p>
              </div>
            </div>
            <Link
              href="/inventory"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#CCCCCC]/50 bg-white hover:bg-slate-100 text-[#111111] px-3.5 py-2 text-xs font-bold shrink-0 transition-standard shadow-xs"
            >
              Restock <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ))}

        {totalActions === 0 && (
          <div className="py-8 text-center">
            <CheckCircle className="h-10 w-10 text-[#15803D] mx-auto opacity-70" />
            <h4 className="text-sm font-black text-[#111111] mt-2">All Tasks Complete</h4>
            <p className="text-xs text-slate-500 mt-1">
              Your store is completely up to date with zero SLA bottlenecks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

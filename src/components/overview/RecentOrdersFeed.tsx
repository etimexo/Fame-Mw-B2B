"use client";

import React from "react";
import Link from "next/link";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { formatNaira, formatDateTime } from "@/lib/utils";
import { OrderStatus } from "@/types";

export default function RecentOrdersFeed() {
  const { orders } = useDashboard();
  const recentOrders = orders.slice(0, 6);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "new":
        return { text: "New Order", bg: "bg-[#82C7EF]/20 text-[#12597f] border-[#82C7EF]/40" };
      case "processing":
        return { text: "Processing", bg: "bg-[#E72A52]/15 text-[#B12642] border-[#E72A52]/30" };
      case "awaiting_fulfillment":
        return { text: "Awaiting SLA", bg: "bg-[#E7000B]/15 text-[#E7000B] border-[#E7000B]/30" };
      case "ready_for_dispatch":
        return { text: "Ready to Dispatch", bg: "bg-[#BCD025]/25 text-[#4c6717] border-[#BCD025]/45" };
      case "shipped":
        return { text: "Shipped", bg: "bg-[#82C7EF]/25 text-[#0d547b] border-[#82C7EF]/50" };
      case "delivered":
        return { text: "Delivered", bg: "bg-[#15803D]/15 text-[#15803D] border-[#15803D]/30" };
      case "cancelled":
        return { text: "Cancelled", bg: "bg-slate-100 text-slate-600 border-slate-200" };
      case "disputed":
        return { text: "Disputed", bg: "bg-[#E7000B]/15 text-[#E7000B] border-[#E7000B]/30" };
      case "returned":
        return { text: "Returned", bg: "bg-[#E7DFA6]/40 text-[#605510] border-[#E7DFA6]/60" };
      default:
        return { text: status, bg: "bg-slate-50 text-slate-700 border-slate-200" };
    }
  };

  return (
    <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <h3 className="text-base font-black text-[#111111] tracking-tight">
            Recent Orders & Fulfillment Stream
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Live stream of incoming customer purchases and dispatched courier consignments.
          </p>
        </div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-black text-[#E72A52] hover:text-[#B12642] transition-standard"
        >
          View All Orders ({orders.length}) <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
              <th className="pb-3.5 pl-3">Order ID</th>
              <th className="pb-3.5">Customer & Destination</th>
              <th className="pb-3.5">Type & Items</th>
              <th className="pb-3.5">Fulfillment Status</th>
              <th className="pb-3.5">Amount</th>
              <th className="pb-3.5 text-right pr-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentOrders.map((order) => {
              const badge = getStatusBadge(order.status);
              return (
                <tr key={order.id} className="hover:bg-[#F9FAFB] transition-standard group">
                  <td className="py-4 pl-3">
                    <span className="font-mono font-black text-[#111111]">
                      #{order.orderNumber}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      {formatDateTime(order.createdAt)}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="font-bold text-[#111111] block">{order.customerName}</span>
                    <span className="text-[11px] text-slate-500 block">
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[9px] font-black uppercase border ${
                          order.items.every((i) => i.type === "digital")
                            ? "bg-[#82C7EF]/20 text-[#12597f] border-[#82C7EF]/40"
                            : "bg-[#BCD025]/20 text-[#4c6717] border-[#BCD025]/40"
                        }`}
                      >
                        {order.items.every((i) => i.type === "digital") ? "Digital" : "Physical"}
                      </span>
                      <span className="text-slate-600 font-medium">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black border ${badge.bg}`}
                    >
                      {badge.text}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="font-mono font-black text-[#111111]">
                      {formatNaira(order.subtotal + order.shippingFee)}
                    </span>
                  </td>
                  <td className="py-4 text-right pr-3">
                    <Link
                      href="/orders"
                      className="inline-flex items-center gap-1 rounded-xl border border-[#CCCCCC]/50 bg-white hover:bg-[#E72A52] hover:text-white hover:border-[#E72A52] px-3 py-1.5 text-xs font-bold text-slate-700 transition-standard shadow-2xs"
                    >
                      Inspect <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

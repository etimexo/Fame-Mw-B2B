"use client";

import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useDashboard } from "@/context/DashboardContext";
import { AlertTriangle, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { orders, disputes } = useDashboard();

  // Highlight any SLA alert approaching
  const urgentOrder = orders.find(
    (o) => o.status === "awaiting_fulfillment" && o.slaDeadline
  );
  const openDispute = disputes.find((d) => d.status === "open");

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex antialiased">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <Header onMobileMenuToggle={() => setMobileMenuOpen(true)} />

        {/* Global Action Banner (if urgent SLA or Dispute) */}
        {urgentOrder && (
          <div className="bg-gradient-to-r from-[#B12642] via-[#E7000B] to-[#B12642] text-white px-4 sm:px-6 py-2.5 text-xs font-semibold flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5 max-w-4xl truncate">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Clock className="h-3.5 w-3.5 text-white animate-pulse" />
              </span>
              <span className="truncate">
                <strong className="tracking-wide uppercase text-[#E7DFA6] mr-1">SLA Fulfillment Alert:</strong>
                Order #{urgentOrder.orderNumber} ({urgentOrder.customerName} - {urgentOrder.shippingAddress.city}) requires dispatch within 4 hours to preserve guarantee.
              </span>
            </div>
            <Link
              href="/orders"
              className="flex items-center gap-1.5 bg-white text-[#B12642] hover:bg-[#E7DFA6] px-3 py-1 rounded-lg text-xs font-black shrink-0 ml-3 transition-standard shadow-xs"
            >
              Fulfill Now <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        {/* Page Content with generous breathing room and responsiveness */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import KpiCards from "@/components/overview/KpiCards";
import RevenueChart from "@/components/overview/RevenueChart";
import ActionRequiredBoard from "@/components/overview/ActionRequiredBoard";
import RecentOrdersFeed from "@/components/overview/RecentOrdersFeed";
import { useDashboard } from "@/context/DashboardContext";
import {
  Sparkles,
  Building2,
  User,
  ShieldCheck,
  Plus,
  Package,
  Wallet,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import FameMeLogo from "@/components/ui/FameMeLogo";

export default function DashboardOverviewPage() {
  const { profile, partnerType } = useDashboard();

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner with Brand Luxury Dark Aesthetics */}
      <div className="relative overflow-hidden rounded-3xl border border-[#CCCCCC]/30 bg-[#111111] p-6 sm:p-9 text-white shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-3.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <FameMeLogo variant="badge" />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#BCD025]/20 px-3 py-1 text-[11px] font-black text-[#BCD025] border border-[#BCD025]/35">
                <Sparkles className="h-3.5 w-3.5" />
                {partnerType === "company" ? "Enterprise Corporate Suite" : "Creator Pro Console"}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#82C7EF]">
                <ShieldCheck className="h-4 w-4 text-[#15803D]" /> {profile.verifiedBadge}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Welcome back,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E72A52] via-[#82C7EF] to-[#BCD025]">
                {profile.businessName}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {profile.tagline}. Operating in verified good standing on FameMe Marketplace with a{" "}
              <strong className="text-white font-black font-mono">{(profile.commissionRate * 100).toFixed(0)}%</strong> platform take-rate. Direct settlement window active.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 shrink-0">
            <Link
              href="/products"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#E72A52] to-[#B12642] hover:opacity-95 px-5 py-3 text-xs font-black text-white shadow-md transition-standard"
            >
              <Plus className="h-4 w-4" /> Add New Product
            </Link>

            <Link
              href="/orders"
              className="flex items-center gap-2 rounded-xl border border-[#CCCCCC]/40 bg-white/10 hover:bg-white/20 px-5 py-3 text-xs font-black text-white transition-standard backdrop-blur-xs"
            >
              <Package className="h-4 w-4" /> View Orders
            </Link>
          </div>
        </div>

        {/* Ambient Brand Glowing Orbs */}
        <div className="absolute -right-12 -bottom-12 h-72 w-72 rounded-full bg-[#E72A52]/25 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 h-64 w-64 rounded-full bg-[#82C7EF]/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-10 h-48 w-48 rounded-full bg-[#BCD025]/15 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards with Brand Palette Evident Accents */}
      <KpiCards />

      {/* Performance Chart & Action Required Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <RevenueChart />
        </div>
        <div className="lg:col-span-4">
          <ActionRequiredBoard />
        </div>
      </div>

      {/* Live Recent Orders Feed */}
      <RecentOrdersFeed />
    </div>
  );
}

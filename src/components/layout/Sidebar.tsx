"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  AlertCircle,
  Star,
  Wallet,
  BarChart3,
  ShieldCheck,
  Users,
  MapPin,
  LifeBuoy,
  X,
  BadgePercent,
  CheckCircle,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import FameMeLogo from "@/components/ui/FameMeLogo";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
  badge?: number;
  badgeColor?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { profile, partnerType, orders, disputes } = useDashboard();

  // Badge counters
  const pendingOrdersCount = orders.filter(
    (o) => o.status === "new" || o.status === "awaiting_fulfillment"
  ).length;
  const activeDisputesCount = disputes.filter(
    (d) => d.status === "open" || d.status === "under_review"
  ).length;

  const navGroups: NavGroup[] = [
    {
      group: "Merchant Core",
      items: [
        { label: "Dashboard", href: "/", icon: LayoutDashboard },
        { label: "Products Catalog", href: "/products", icon: Package },
        { label: "Inventory Center", href: "/inventory", icon: Boxes },
      ],
    },
    {
      group: "Sales & Operations",
      items: [
        {
          label: "Orders Pipeline",
          href: "/orders",
          icon: ShoppingCart,
          badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
          badgeColor: "bg-[#82C7EF]/25 text-[#135a80] border border-[#82C7EF]/40",
        },
        {
          label: "Disputes & Returns",
          href: "/disputes",
          icon: AlertCircle,
          badge: activeDisputesCount > 0 ? activeDisputesCount : undefined,
          badgeColor: "bg-[#E72A52]/15 text-[#B12642] border border-[#E72A52]/30",
        },
        { label: "Reviews & Ratings", href: "/reviews", icon: Star },
      ],
    },
    {
      group: "Finance & Intelligence",
      items: [
        { label: "Finance & Payouts", href: "/finance", icon: Wallet },
        { label: "Sales Analytics", href: "/analytics", icon: BarChart3 },
      ],
    },
    {
      group: "Store Management",
      items: [
        { label: "Profile & KYC", href: "/settings/profile", icon: ShieldCheck },
        ...(partnerType === "company"
          ? [
              { label: "Team & Staff", href: "/settings/team", icon: Users, tag: "Company" },
              { label: "Branches & Warehouses", href: "/settings/branches", icon: MapPin, tag: "Company" },
            ]
          : []),
        { label: "Support & Help", href: "/support", icon: LifeBuoy },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-[#111111]/60 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-68 sm:w-72 flex-col border-r border-[#CCCCCC]/40 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shadow-sm ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header (visible on mobile drawer) */}
        <div className="flex h-16 items-center justify-between border-b border-[#CCCCCC]/40 px-5 lg:hidden">
          <FameMeLogo variant="horizontal" />
          <button
            onClick={onMobileClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-[#111111]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Store Profile Card summary */}
        <div className="p-4 border-b border-[#CCCCCC]/30 bg-gradient-to-b from-[#F9FAFB] to-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.logo}
                alt={profile.businessName}
                className="h-11 w-11 rounded-2xl object-cover ring-2 ring-[#E72A52]/25 shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#15803D] text-white ring-2 ring-white">
                <CheckCircle className="h-3 w-3" />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xs font-black text-[#111111] truncate tracking-tight">
                {profile.businessName}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#15803D] bg-[#15803D]/10 px-2 py-0.5 rounded-full border border-[#15803D]/20">
                  <ShieldCheck className="h-3 w-3" />
                  {profile.kycStatus === "verified" ? "Verified Partner" : "Pending KYC"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1.5">
              <h3 className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                {group.group}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onMobileClose}
                      className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-standard ${
                        isActive
                          ? "bg-gradient-to-r from-[#E72A52] to-[#B12642] text-white shadow-sm"
                          : "text-slate-600 hover:bg-[#F3F4F6] hover:text-[#111111]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={`h-4 w-4 shrink-0 transition-standard ${
                            isActive
                              ? "text-white"
                              : "text-slate-400 group-hover:text-[#E72A52]"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.tag && !isActive && (
                          <span className="rounded-md bg-[#BCD025]/20 text-[#4c6717] border border-[#BCD025]/40 px-1.5 py-0.5 text-[9px] font-black tracking-wide">
                            {item.tag}
                          </span>
                        )}
                        {item.badge && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                              isActive ? "bg-white text-[#B12642]" : item.badgeColor
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Commission Tier Footer Card */}
        <div className="p-3.5 border-t border-[#CCCCCC]/40 bg-[#F9FAFB]">
          <div className="rounded-2xl border border-[#E7DFA6] bg-gradient-to-br from-[#E7DFA6]/30 via-white to-[#82C7EF]/15 p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-black text-[#111111]">
                <BadgePercent className="h-4 w-4 text-[#E72A52]" />
                {partnerType === "company" ? "Corporate Tier 1" : "Creator Pro Tier"}
              </span>
              <span className="rounded-lg bg-[#E72A52] px-2 py-0.5 text-[10px] font-black text-white shadow-2xs">
                {(profile.commissionRate * 100).toFixed(0)}% TAKE
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-600 leading-relaxed font-medium">
              {partnerType === "company"
                ? "Enterprise multi-channel take rate. Payouts settled within 24h window."
                : "Standard creator rate. Escrow protected with direct Nigerian bank settlements."}
            </p>
            <div className="mt-3 pt-2.5 border-t border-[#CCCCCC]/30 flex items-center justify-between text-[10px]">
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#15803D]" /> Active & Verified
              </span>
              <Link href="/settings/profile" className="font-bold text-[#E72A52] hover:text-[#B12642] hover:underline">
                View Agreement
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

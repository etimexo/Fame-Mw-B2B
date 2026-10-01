"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Building2,
  User,
  CheckCircle2,
  ChevronDown,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Search,
  Sparkles,
  Layers,
  X,
  AlertTriangle,
  Package,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { formatRelativeTime } from "@/lib/utils";
import FameMeLogo from "@/components/ui/FameMeLogo";

export default function Header({ onMobileMenuToggle }: { onMobileMenuToggle?: () => void }) {
  const pathname = usePathname();
  const {
    partnerType,
    switchPartnerType,
    profile,
    activeBranchId,
    setActiveBranchId,
    branches,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useDashboard();

  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const currentBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  return (
    <header className="sticky top-0 z-30 flex h-17 w-full items-center justify-between border-b border-[#CCCCCC]/40 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
      {/* Left: Mobile hamburger & Logo */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onMobileMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#CCCCCC]/50 text-slate-700 hover:bg-[#F9FAFB] hover:text-[#111111] lg:hidden transition-standard"
          aria-label="Toggle menu"
        >
          <Layers className="h-5 w-5" />
        </button>

        {/* Brand lockup */}
        <Link href="/" className="flex items-center transition-standard hover:opacity-90">
          <FameMeLogo variant="horizontal" />
        </Link>
      </div>

      {/* Middle: Quick Global Search (Visible on md+) */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders, SKU, customer name, waybill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#F9FAFB] border border-[#CCCCCC]/50 text-xs text-[#111111] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20 focus:border-[#E72A52] transition-standard"
          />
        </div>
      </div>

      {/* Right: Partner Context Switcher & Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Branch Switcher (Company Only) */}
        {partnerType === "company" && (
          <div className="relative hidden xl:block">
            <button
              onClick={() => {
                setShowBranchMenu(!showBranchMenu);
                setShowTypeMenu(false);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 rounded-xl border border-[#CCCCCC]/50 bg-[#F9FAFB] px-3 py-2 text-xs font-semibold text-[#111111] hover:bg-slate-100 transition-standard"
            >
              <MapPin className="h-3.5 w-3.5 text-[#E72A52]" />
              <span className="truncate max-w-[130px]">{currentBranch?.name}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showBranchMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#CCCCCC]/40 bg-white p-2.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Select Dispatch Branch
                </div>
                <div className="space-y-1 mt-1">
                  {branches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setActiveBranchId(b.id);
                        setShowBranchMenu(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-left transition-standard ${
                        b.id === activeBranchId
                          ? "bg-[#E72A52]/10 text-[#E72A52]"
                          : "text-slate-700 hover:bg-[#F9FAFB]"
                      }`}
                    >
                      <div className="truncate">
                        <p className="font-bold truncate">{b.name}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{b.city}, {b.state}</p>
                      </div>
                      {b.id === activeBranchId && (
                        <CheckCircle2 className="h-4 w-4 text-[#E72A52] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <Link
                    href="/settings/branches"
                    onClick={() => setShowBranchMenu(false)}
                    className="block text-center text-[11px] font-bold text-[#E72A52] hover:text-[#B12642] py-1"
                  >
                    Manage All Branches →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Partner Role / Profile Switcher Modal Toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setShowTypeMenu(!showTypeMenu);
              setShowBranchMenu(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 rounded-xl border border-[#CCCCCC]/50 bg-white px-3 py-1.5 text-xs font-bold text-[#111111] hover:bg-[#F9FAFB] transition-standard shadow-2xs"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#111111] text-[#BCD025]">
              {partnerType === "company" ? (
                <Building2 className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[11px] font-black truncate max-w-[120px] text-[#111111]">
                {profile.businessName}
              </span>
              <span className="text-[9px] font-extrabold text-[#E72A52] uppercase tracking-wider">
                {partnerType === "company" ? "Corporate" : "Creator Pro"}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showTypeMenu && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border border-[#CCCCCC]/40 bg-white p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-2 pb-2 border-b border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Switch Active Persona
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Test dual merchant experiences supported by FameMe B2B.
                </p>
              </div>

              <div className="mt-2 space-y-1.5">
                {/* Company Partner Option */}
                <button
                  onClick={() => {
                    switchPartnerType("company");
                    setShowTypeMenu(false);
                  }}
                  className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-standard ${
                    partnerType === "company"
                      ? "bg-[#E72A52]/10 border border-[#E72A52]/30"
                      : "hover:bg-[#F9FAFB]"
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#111111] text-[#BCD025]">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#111111]">AfroGroove Media Ltd</span>
                      {partnerType === "company" && (
                        <CheckCircle2 className="h-4 w-4 text-[#E72A52]" />
                      )}
                    </div>
                    <span className="inline-block rounded-md bg-[#BCD025]/20 text-[#4c6717] px-1.5 py-0.5 text-[9px] font-black tracking-wide mt-1">
                      Company Partner • 8% Take-Rate
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Multi-user RBAC, warehouse branches, corporate CAC KYC.
                    </p>
                  </div>
                </button>

                {/* Individual Seller Option */}
                <button
                  onClick={() => {
                    switchPartnerType("seller");
                    setShowTypeMenu(false);
                  }}
                  className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-standard ${
                    partnerType === "seller"
                      ? "bg-[#82C7EF]/15 border border-[#82C7EF]/30"
                      : "hover:bg-[#F9FAFB]"
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#82C7EF]/20 text-[#12597f]">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#111111]">Tunde Beats & Merch</span>
                      {partnerType === "seller" && (
                        <CheckCircle2 className="h-4 w-4 text-[#12597f]" />
                      )}
                    </div>
                    <span className="inline-block rounded-md bg-[#82C7EF]/20 text-[#12597f] px-1.5 py-0.5 text-[9px] font-black tracking-wide mt-1">
                      Verified Seller • 12% Take-Rate
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Solopreneur & audio stem creator streamlined flow.
                    </p>
                  </div>
                </button>
              </div>

              <div className="mt-2.5 border-t border-slate-100 pt-2.5 px-2 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5 text-[#15803D] font-bold">
                  <ShieldCheck className="h-3.5 w-3.5" /> Both KYC Verified
                </span>
                <Link
                  href="/settings/profile"
                  onClick={() => setShowTypeMenu(false)}
                  className="text-[#E72A52] hover:text-[#B12642] hover:underline font-bold"
                >
                  Manage Profile
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowTypeMenu(false);
              setShowBranchMenu(false);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#CCCCCC]/50 bg-white text-slate-700 hover:bg-[#F9FAFB] hover:text-[#111111] transition-standard shadow-2xs"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#E72A52] text-[10px] font-black text-white shadow-xs animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[#CCCCCC]/40 bg-white shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#111111]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-[#E72A52]/10 px-2 py-0.5 text-[10px] font-extrabold text-[#E72A52]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-bold text-[#E72A52] hover:text-[#B12642]"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3.5 text-xs cursor-pointer transition-standard hover:bg-[#F9FAFB] flex gap-3 ${
                      !n.read ? "bg-[#E72A52]/5" : ""
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {n.type === "order" ? (
                        <div className="h-7 w-7 rounded-lg bg-[#82C7EF]/20 text-[#12597f] flex items-center justify-center">
                          <Package className="h-4 w-4" />
                        </div>
                      ) : n.type === "dispute" ? (
                        <div className="h-7 w-7 rounded-lg bg-[#E72A52]/20 text-[#E72A52] flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="h-7 w-7 rounded-lg bg-[#BCD025]/25 text-[#4c6717] flex items-center justify-center">
                          <Sparkles className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#111111] truncate">{n.title}</span>
                        {!n.read && <span className="h-2 w-2 rounded-full bg-[#E72A52] shrink-0 ml-1" />}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {formatRelativeTime(n.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 p-3 text-center">
                <Link
                  href="/support"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-bold text-[#E72A52] hover:text-[#B12642]"
                >
                  Visit Support & Notification Center →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Live Storefront Link */}
        <a
          href="https://fame-me-productions.yrjxc7zgbb.chatgpt.site"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 rounded-xl border border-[#CCCCCC]/50 bg-white px-3 py-2 text-xs font-bold text-[#111111] hover:border-[#E72A52]/40 hover:text-[#E72A52] transition-standard shadow-2xs"
          title="Visit Customer-Facing Marketplace"
        >
          <span>Marketplace</span>
          <ExternalLink className="h-3 w-3 text-slate-400" />
        </a>
      </div>
    </header>
  );
}

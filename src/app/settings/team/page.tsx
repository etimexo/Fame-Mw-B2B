"use client";

import React from "react";
import TeamSettings from "@/components/settings/TeamSettings";
import { useDashboard } from "@/context/DashboardContext";
import { Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TeamPage() {
  const { partnerType, switchPartnerType } = useDashboard();

  if (partnerType !== "company") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center max-w-xl mx-auto my-12 shadow-xs space-y-4">
        <div className="h-12 w-12 rounded-2xl bg-[#E72A52]/10 text-[#E72A52] flex items-center justify-center mx-auto">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Team & Staff Management is a Company Partner Feature
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            You are currently viewing the hub as an Individual Seller (Tunde Beats & Merch). Registered businesses with a CAC Certificate can invite team members and configure Role-Based Access Control.
          </p>
        </div>
        <button
          onClick={() => switchPartnerType("company")}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#E72A52] hover:bg-[#B12642] px-4 py-2 text-xs font-bold text-white shadow-xs transition-standard"
        >
          Switch to AfroGroove Media Ltd (Company Mode) <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return <TeamSettings />;
}

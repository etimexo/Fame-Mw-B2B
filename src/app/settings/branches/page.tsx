"use client";

import React from "react";
import BranchesSettings from "@/components/settings/BranchesSettings";
import { useDashboard } from "@/context/DashboardContext";
import { MapPin, ArrowRight } from "lucide-react";

export default function BranchesPage() {
  const { partnerType, switchPartnerType } = useDashboard();

  if (partnerType !== "company") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center max-w-xl mx-auto my-12 shadow-xs space-y-4">
        <div className="h-12 w-12 rounded-2xl bg-[#E72A52]/10 text-[#E72A52] flex items-center justify-center mx-auto">
          <MapPin className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Multi-Warehouse Branches is a Company Partner Feature
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            You are currently viewing the hub as an Individual Seller. Registered enterprises can configure multiple warehouse branches and dispatch points for GIG and DHL courier pickups.
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

  return <BranchesSettings />;
}

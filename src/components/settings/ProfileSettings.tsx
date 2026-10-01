"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Building2,
  User,
  CheckCircle2,
  Upload,
  FileText,
  BadgePercent,
  Clock,
  Sparkles,
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  Lock,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export default function ProfileSettings() {
  const { profile, partnerType, updateProfile } = useDashboard();

  // Local form state
  const [businessName, setBusinessName] = useState(profile.businessName);
  const [tagline, setTagline] = useState(profile.tagline);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [city, setCity] = useState(profile.city);
  const [state, setState] = useState(profile.state);
  const [bio, setBio] = useState(profile.bio);
  const [cacNumber, setCacNumber] = useState(profile.cacNumber || "RC-1849204");
  const [tinNumber, setTinNumber] = useState(profile.tinNumber || "23940182-0001");
  const [ninNumber, setNinNumber] = useState(profile.ninNumber || "7192-8301-9241");
  const [toastMessage, setToastMessage] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      businessName,
      tagline,
      email,
      phone,
      address,
      city,
      state,
      bio,
      ...(partnerType === "company" ? { cacNumber, tinNumber } : { ninNumber }),
    });
    setToastMessage("Storefront details and KYC records updated successfully!");
    setTimeout(() => setToastMessage(""), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Store Profile & Partner KYC Verification
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your public marketplace storefront details, verified credentials, and commission agreement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            {profile.verifiedBadge}
          </span>
        </div>
      </div>

      {toastMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Commission Tier Status Card */}
      <div className="rounded-2xl border border-[#E72A52]/30 bg-gradient-to-r from-[#E7DFA6]/20/80 via-white to-[#82C7EF]/15/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E72A52] text-white">
              <BadgePercent className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{profile.tierName}</h3>
                <span className="rounded bg-[#82C7EF]/20 px-2 py-0.5 text-[10px] font-extrabold text-[#B12642]">
                  {(profile.commissionRate * 100).toFixed(0)}% FIXED TAKE-RATE
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                {partnerType === "company"
                  ? "Enterprise negotiated tier with priority courier waybill generation, multi-user role management, and dedicated account manager."
                  : "Solopreneur & audio creator tier with instant digital fulfillment and 7-day escrow protection."}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs shrink-0">
            <div className="flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Agreement Signed
            </div>
            <span className="text-[11px] text-slate-400">
              Valid through Dec 31, 2026
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Storefront Visuals & Brand Details */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Public Storefront Information
            </h3>
            <span className="text-xs text-slate-400">Displayed on FameMe marketplace</span>
          </div>

          {/* Banner & Logo Visual Mock */}
          <div className="relative rounded-xl overflow-hidden border border-slate-200">
            {/* Banner */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.banner}
              alt="Store banner"
              className="h-32 sm:h-40 w-full object-cover"
            />
            {/* Logo Overlay */}
            <div className="absolute -bottom-2 left-6 transform translate-y-1/2 flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.logo}
                alt="Logo"
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover ring-4 ring-white shadow-md"
              />
            </div>
          </div>

          <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Storefront Display Name *
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Brand Headline / Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Store Bio / About Merchant
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Customer Support Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Merchant Hotline Phone *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                State & City *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={`${city}, ${state}`}
                  onChange={(e) => {
                    const parts = e.target.value.split(",");
                    setCity(parts[0]?.trim() || "");
                    if (parts[1]) setState(parts[1].trim());
                  }}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* KYC Verification Module (Company vs Individual) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#E72A52]" />
              <h3 className="text-sm font-bold text-slate-900">
                {partnerType === "company"
                  ? "Corporate KYC & CAC Registration Records"
                  : "Individual Seller & Creator Verification Records"}
              </h3>
            </div>
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
              Verified & Approved
            </span>
          </div>

          {partnerType === "company" ? (
            /* Company KYC */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    CAC Registration Number (RC) *
                  </label>
                  <input
                    type="text"
                    required
                    value={cacNumber}
                    onChange={(e) => setCacNumber(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Federal Tax Identification Number (TIN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={tinNumber}
                    onChange={(e) => setTinNumber(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                  />
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <FileText className="h-4 w-4 text-[#E72A52]" />
                    <div>
                      <div className="font-bold text-slate-900">CAC Certificate</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">Verified PDF</div>
                    </div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>

                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <FileText className="h-4 w-4 text-[#E72A52]" />
                    <div>
                      <div className="font-bold text-slate-900">Status Report / Form 1.1</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">Verified PDF</div>
                    </div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>

                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <FileText className="h-4 w-4 text-[#E72A52]" />
                    <div>
                      <div className="font-bold text-slate-900">Director&apos;s NIN Card</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">Verified Image</div>
                    </div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
            </div>
          ) : (
            /* Individual KYC */
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  National Identification Number (NIN) / Voter&apos;s Card *
                </label>
                <input
                  type="text"
                  required
                  value={ninNumber}
                  onChange={(e) => setNinNumber(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <FileText className="h-4 w-4 text-[#E72A52]" />
                    <div>
                      <div className="font-bold text-slate-900">Government ID Slip</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">NIN Verified Match</div>
                    </div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>

                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <FileText className="h-4 w-4 text-[#E72A52]" />
                    <div>
                      <div className="font-bold text-slate-900">Proof of Address (Utility)</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">Verified Lagos State</div>
                    </div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-[#E72A52] hover:bg-[#B12642] px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-standard"
          >
            <Save className="h-4 w-4" /> Save Profile & Verification Changes
          </button>
        </div>
      </form>
    </div>
  );
}

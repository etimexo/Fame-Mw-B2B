"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  Mail,
  Shield,
  Trash2,
  CheckCircle2,
  X,
  UserCheck,
  Building2,
  AlertTriangle,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { StaffMember, StaffRole } from "@/types";

export default function TeamSettings() {
  const { staff, inviteStaff, removeStaff, partnerType } = useDashboard();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<StaffRole>("fulfillment");
  const [toastMessage, setToastMessage] = useState("");

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    inviteStaff({
      name,
      email,
      phone,
      role,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&h=128&q=80",
    });

    setIsInviteModalOpen(false);
    setName("");
    setEmail("");
    setPhone("");
    setRole("fulfillment");
    setToastMessage(`Invitation sent to ${email} with role: ${role.toUpperCase()}`);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const getRoleBadge = (role: StaffRole) => {
    switch (role) {
      case "owner":
        return { label: "Owner (Full Admin)", class: "bg-purple-50 text-purple-700 border-purple-200" };
      case "manager":
        return { label: "Store Manager", class: "bg-[#E72A52]/10 text-[#B12642] border-[#E72A52]/30" };
      case "fulfillment":
        return { label: "Fulfillment Staff", class: "bg-blue-50 text-blue-700 border-blue-200" };
      case "accountant":
        return { label: "Accountant", class: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Team & Role-Based Access Control (RBAC)
            </h1>
            <span className="rounded bg-[#82C7EF]/20 px-2 py-0.5 text-[10px] font-extrabold text-[#B12642] uppercase">
              Company Feature
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Delegate operational fulfillment, store management, and financial auditing with granular permissions.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-[#E72A52] hover:bg-[#B12642] px-4 py-2 text-xs font-bold text-white shadow-xs transition-standard"
        >
          <Plus className="h-4 w-4" /> Invite Team Member
        </button>
      </div>

      {toastMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Permissions Matrix Reference Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Platform Role Permissions Matrix
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-3">
            <span className="font-bold text-purple-900 block">Owner</span>
            <p className="text-[11px] text-slate-600 mt-1">
              Full access including bank details, withdrawal triggers, staff hiring, and legal KYC.
            </p>
          </div>

          <div className="rounded-xl border border-[#E72A52]/30 bg-[#E72A52]/10/50 p-3">
            <span className="font-bold text-[#111111] block">Store Manager</span>
            <p className="text-[11px] text-slate-600 mt-1">
              Catalog edits, pricing, order fulfillment, and dispute replies. No payout access.
            </p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3">
            <span className="font-bold text-blue-900 block">Fulfillment Staff</span>
            <p className="text-[11px] text-slate-600 mt-1">
              Waybill printing, courier dispatch, and warehouse stock quantity adjustments only.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
            <span className="font-bold text-emerald-900 block">Accountant</span>
            <p className="text-[11px] text-slate-600 mt-1">
              Read-only financial statements, ledger review, and revenue analytics export.
            </p>
          </div>
        </div>
      </div>

      {/* Staff Roster Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900">
            Active Staff Roster ({staff.length})
          </span>
          <span className="text-xs text-slate-400">Company Multi-User License Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 pl-4">Staff Member</th>
                <th className="py-3.5">Assigned Role</th>
                <th className="py-3.5">Phone Number</th>
                <th className="py-3.5">Account Status</th>
                <th className="py-3.5">Activity</th>
                <th className="py-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((s) => {
                const badge = getRoleBadge(s.role);
                const isOwner = s.role === "owner";

                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-standard">
                    <td className="py-3.5 pl-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.avatar}
                          alt={s.name}
                          className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{s.name}</span>
                          <span className="text-[11px] text-slate-500">{s.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${badge.class}`}
                      >
                        {badge.label}
                      </span>
                    </td>

                    <td className="py-3.5 font-mono text-slate-600">
                      {s.phone}
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          s.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    <td className="py-3.5 text-slate-500 text-[11px]">
                      {s.lastActive}
                    </td>

                    <td className="py-3.5 pr-4 text-right">
                      {!isOwner && (
                        <button
                          onClick={() => removeStaff(s.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-standard"
                          title="Revoke Staff Access"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Invite Staff Member</h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Adeola Adeleke"
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Company Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. adeola@afrogroove.ng"
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Role Assignment *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StaffRole)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                >
                  <option value="manager">Store Manager (Catalog & Fulfillment)</option>
                  <option value="fulfillment">Fulfillment Staff (Waybills & Stock Stepper)</option>
                  <option value="accountant">Accountant (Ledger & Statement Export)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#E72A52] hover:bg-[#B12642] px-4 py-2 text-xs font-bold text-white shadow-xs"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

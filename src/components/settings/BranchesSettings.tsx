"use client";

import React, { useState } from "react";
import {
  MapPin,
  Plus,
  Building2,
  Phone,
  User,
  CheckCircle2,
  X,
  Boxes,
  Truck,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { Branch } from "@/types";

export default function BranchesSettings() {
  const { branches, addBranch, activeBranchId, setActiveBranchId } = useDashboard();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Lagos");
  const [state, setState] = useState("Lagos State");
  const [managerName, setManagerName] = useState("");
  const [phone, setPhone] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    addBranch({
      name,
      code: `${city.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      address,
      city,
      state,
      managerName,
      phone,
      isHQ: false,
    });

    setIsModalOpen(false);
    setName("");
    setAddress("");
    setManagerName("");
    setPhone("");
    setToastMessage(`Branch "${name}" successfully registered for courier pickups!`);
    setTimeout(() => setToastMessage(""), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Warehouse Branches & Courier Pickup Points
            </h1>
            <span className="rounded bg-[#82C7EF]/20 px-2 py-0.5 text-[10px] font-extrabold text-[#B12642] uppercase">
              Company Feature
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered physical warehouses where GIG Logistics, DHL, and Kwik riders collect dispatched orders.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-[#E72A52] hover:bg-[#B12642] px-4 py-2 text-xs font-bold text-white shadow-xs transition-standard"
        >
          <Plus className="h-4 w-4" /> Add Pickup Location
        </button>
      </div>

      {toastMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Branches List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map((b) => {
          const isSelected = b.id === activeBranchId;

          return (
            <div
              key={b.id}
              className={`rounded-2xl border p-5 bg-white shadow-xs space-y-3 transition-standard ${
                isSelected
                  ? "border-[#E72A52] ring-2 ring-[#E72A52]/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-sm">{b.name}</span>
                    {b.isHQ && (
                      <span className="rounded bg-[#82C7EF]/20 text-[#B12642] px-1.5 py-0.2 text-[9px] font-bold">
                        PRIMARY HQ
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">Code: {b.code}</span>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E72A52]/10 text-[#E72A52]">
                  <Building2 className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{b.address}, {b.city}, {b.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>Lead: <strong>{b.managerName}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-mono">{b.phone}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Boxes className="h-3 w-3" /> {b.activeStockUnits} Active Stock Units
                </span>

                <button
                  onClick={() => setActiveBranchId(b.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-standard ${
                    isSelected
                      ? "bg-[#E72A52] text-white"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {isSelected ? "Active Pickup" : "Select"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Branch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Warehouse Pickup Branch</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Branch / Warehouse Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Victoria Island Express Hub"
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 14 Adeola Odeku Street"
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Hub Lead Manager
                  </label>
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="e.g. Babatunde G."
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Dispatch Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#E72A52] hover:bg-[#B12642] px-4 py-2 text-xs font-bold text-white shadow-xs"
                >
                  Register Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

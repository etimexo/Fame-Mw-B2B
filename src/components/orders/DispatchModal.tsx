"use client";

import React, { useState } from "react";
import { Order } from "@/types";
import { useDashboard } from "@/context/DashboardContext";
import { X, Truck, CheckCircle2, MapPin } from "lucide-react";

interface DispatchModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DispatchModal({ order, isOpen, onClose }: DispatchModalProps) {
  const { dispatchOrder, branches, activeBranchId } = useDashboard();

  const [courier, setCourier] = useState("GIG Logistics");
  const [trackingNumber, setTrackingNumber] = useState(
    `GIG-LG-${Math.floor(10000000 + Math.random() * 90000000)}`
  );
  const [branch, setBranch] = useState(
    branches.find((b) => b.id === activeBranchId)?.name || branches[0]?.name || "Main Lekki Hub (HQ)"
  );

  if (!isOpen || !order) return null;

  const handleCourierChange = (selectedCourier: string) => {
    setCourier(selectedCourier);
    let prefix = "GIG-LG-";
    if (selectedCourier.includes("DHL")) prefix = "DHL-NG-";
    if (selectedCourier.includes("Kwik")) prefix = "KWIK-";
    if (selectedCourier.includes("Speedaf")) prefix = "SPF-NG-";
    if (selectedCourier.includes("Fez")) prefix = "FEZ-LG-";

    setTrackingNumber(`${prefix}${Math.floor(10000000 + Math.random() * 90000000)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatchOrder(order.id, courier, trackingNumber, branch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Mark Order as Dispatched</h3>
              <p className="text-[11px] text-slate-500">Order #{order.orderNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Select Logistics Courier *
            </label>
            <select
              value={courier}
              onChange={(e) => handleCourierChange(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="GIG Logistics">GIG Logistics (Nationwide Direct Pickup)</option>
              <option value="DHL Express Nigeria">DHL Express Nigeria (Inter-State & Global)</option>
              <option value="Kwik Delivery">Kwik Delivery (Same-Day Lagos / Intra-City)</option>
              <option value="Speedaf Nigeria">Speedaf Express Nigeria</option>
              <option value="Fez Delivery">Fez Delivery Hub</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Airway Bill / Tracking Code *
            </label>
            <input
              type="text"
              required
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Dispatching Warehouse / Branch
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-xs text-slate-600">
            <span className="font-semibold text-blue-900 block mb-0.5">Automated SMS & Email</span>
            Once dispatched, the customer ({order.customerName}) will immediately receive an automated notification with live tracking link.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-standard"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-standard"
            >
              Confirm Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

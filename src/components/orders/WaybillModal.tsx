"use client";

import React from "react";
import { Order } from "@/types";
import { useDashboard } from "@/context/DashboardContext";
import { formatNaira, formatDateTime, formatDate } from "@/lib/utils";
import { X, Printer, Truck, ShieldCheck, QrCode } from "lucide-react";
import FameMeLogo from "@/components/ui/FameMeLogo";

interface WaybillModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function WaybillModal({ order, isOpen, onClose }: WaybillModalProps) {
  const { profile } = useDashboard();

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const courierName = order.courier || "GIG Logistics Nigeria (Designated Marketplace Courier)";
  const trackingNo = order.trackingNumber || `WAYBILL-FM-${order.orderNumber.replace("FM-ORD-", "")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 my-8">
        {/* Controls top bar (hidden in print) */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 rounded-t-2xl print:hidden">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-[#E72A52]" />
            <span className="text-sm font-bold text-slate-900">
              Official Shipping Waybill & Package Label
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-[#E72A52] hover:bg-[#B12642] px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-standard"
            >
              <Printer className="h-4 w-4" /> Print Label
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Waybill Sheet */}
        <div id="printable-waybill" className="p-8 text-slate-900 bg-white">
          {/* Header Banner */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
            <div className="flex items-center gap-3">
              <FameMeLogo variant="badge" className="scale-105 origin-left" />
              <div>
                <div className="text-xl font-black tracking-tight text-slate-900">
                  FAME & ME <span className="text-xs font-bold uppercase tracking-wider text-slate-500">EXPRESS LOGISTICS</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Marketplace Merchant Waybill • Standard Domestic & Inter-State Transit
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block rounded border border-slate-900 px-2 py-0.5 text-xs font-black uppercase">
                {courierName.split(" ")[0]} AIRWAY BILL
              </span>
              <div className="text-xs font-mono font-bold mt-1 text-slate-800">
                DATE: {formatDate(new Date().toISOString())}
              </div>
            </div>
          </div>

          {/* Barcode Section Simulation */}
          <div className="my-5 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/70 p-4 text-center">
            {/* Visual Barcode bars */}
            <div className="h-14 w-72 flex items-center justify-center space-x-1">
              {[3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9, 5, 0, 2, 8, 8, 4, 1, 9, 7, 1, 6, 9, 3, 9, 9, 3, 7, 5, 1, 0].map((w, idx) => (
                <div
                  key={idx}
                  style={{ width: `${(w % 3) + 1.5}px` }}
                  className="h-full bg-slate-900"
                />
              ))}
            </div>
            <span className="font-mono text-xs font-bold tracking-widest text-slate-800 mt-1">
              *{trackingNo}*
            </span>
          </div>

          {/* Sender & Receiver 2-Column Grid */}
          <div className="grid grid-cols-2 gap-6 border-b border-slate-200 pb-5">
            {/* Sender (Merchant) */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                FROM (SHIPPER / MERCHANT):
              </span>
              <div className="text-xs font-bold text-slate-900">{profile.businessName}</div>
              <div className="text-xs text-slate-600">{order.dispatchBranch || profile.address}</div>
              <div className="text-xs text-slate-600">{profile.city}, {profile.state}, Nigeria</div>
              <div className="text-xs text-slate-600 font-mono">TEL: {profile.phone}</div>
              <div className="text-[10px] font-semibold text-[#B12642] bg-[#E72A52]/10 inline-block px-1.5 py-0.5 rounded mt-1">
                FameMe Verified Merchant ID: {profile.id.toUpperCase()}
              </div>
            </div>

            {/* Recipient (Customer) */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                DELIVER TO (CONSIGNEE):
              </span>
              <div className="text-xs font-bold text-slate-900">{order.customerName}</div>
              <div className="text-xs text-slate-800 font-semibold">{order.shippingAddress.street}</div>
              <div className="text-xs text-slate-800 font-bold">
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </div>
              <div className="text-xs text-slate-600 font-mono">TEL: {order.customerPhone}</div>
              <div className="text-xs text-slate-600">{order.customerEmail}</div>
            </div>
          </div>

          {/* Package Manifest */}
          <div className="my-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              PACKAGE CONTENTS MANIFEST:
            </span>
            <table className="w-full mt-2 text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500">
                  <th className="pb-1">Item Title & SKU</th>
                  <th className="pb-1 text-center">Type</th>
                  <th className="pb-1 text-center">Qty</th>
                  <th className="pb-1 text-right">Declared Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2">
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="text-[10px] font-mono text-slate-500">
                        SKU: {item.sku} {item.variantName ? `(${item.variantName})` : ""}
                      </div>
                    </td>
                    <td className="py-2 text-center uppercase text-[10px] font-bold text-slate-600">
                      {item.type}
                    </td>
                    <td className="py-2 text-center font-mono font-bold">{item.quantity}</td>
                    <td className="py-2 text-right font-mono font-bold">
                      {formatNaira(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Logistics Handling Notes */}
          <div className="mt-4 rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">
                Courier Handling: {courierName}
              </span>
              <span className="font-mono font-bold text-[#B12642]">
                Tracking: {trackingNo}
              </span>
            </div>
            {order.notes && (
              <p className="mt-1 text-[11px] text-slate-600">
                <strong>Customer Note:</strong> {order.notes}
              </p>
            )}
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200 pt-2">
              <span>Security Tape Intact • Inspection Required Before Signing</span>
              <span className="font-bold text-slate-700">DO NOT BEND / FRAGILE RECORDING MEDIA</span>
            </div>
          </div>

          {/* Footer Signatures */}
          <div className="mt-6 pt-4 border-t border-slate-300 grid grid-cols-2 gap-8 text-[11px] text-slate-600">
            <div>
              <div className="border-b border-slate-400 pb-8" />
              <div className="mt-1 font-semibold">Dispatch Agent Signature & Stamp</div>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-8" />
              <div className="mt-1 font-semibold">Rider / Receiver Signature & Date</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

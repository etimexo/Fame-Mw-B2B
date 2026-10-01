"use client";

import React, { useState } from "react";
import { Order, OrderStatus } from "@/types";
import { useDashboard } from "@/context/DashboardContext";
import { formatNaira, formatDateTime } from "@/lib/utils";
import {
  X,
  Printer,
  Truck,
  CheckCircle2,
  Clock,
  RefreshCw,
  Package,
  Music,
  MapPin,
  Mail,
  Phone,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface OrderDetailDrawerProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenWaybill: (order: Order) => void;
  onOpenDispatch: (order: Order) => void;
}

export default function OrderDetailDrawer({
  order,
  isOpen,
  onClose,
  onOpenWaybill,
  onOpenDispatch,
}: OrderDetailDrawerProps) {
  const { updateOrderStatus, reissueDigitalLink } = useDashboard();
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleReissue = (productId: string) => {
    const freshUrl = reissueDigitalLink(order.id, productId);
    handleCopyLink(freshUrl);
  };

  const steps: OrderStatus[] = [
    "new",
    "processing",
    "ready_for_dispatch",
    "shipped",
    "delivered",
  ];

  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-xl h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E72A52]/10 text-[#E72A52]">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{order.orderNumber}</h3>
                <span className="rounded bg-[#82C7EF]/20 px-1.5 py-0.2 text-[10px] font-bold text-[#111111] uppercase">
                  {order.status.replace("_", " ")}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Order Progress Stepper */}
          {order.status !== "cancelled" && order.status !== "returned" && order.status !== "disputed" && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="text-xs font-bold text-slate-800 mb-3">Fulfillment Lifecycle</div>
              <div className="flex items-center justify-between text-center relative">
                {steps.map((st, idx) => {
                  const isDone = currentStepIndex >= idx;
                  const isCurrent = currentStepIndex === idx;
                  return (
                    <div key={st} className="flex-1 flex flex-col items-center relative z-10">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-standard ${
                          isDone
                            ? "bg-[#E72A52] text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {isDone ? <Check className="h-3 w-3" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[9px] uppercase tracking-wider mt-1 font-semibold ${
                          isCurrent ? "text-[#E72A52] font-bold" : "text-slate-400"
                        }`}
                      >
                        {st.replace(/_/g, " ").slice(0, 8)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenWaybill(order)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2.5 px-3 text-xs font-bold text-slate-800 shadow-2xs transition-standard"
            >
              <Printer className="h-4 w-4 text-[#E72A52]" /> Print Waybill
            </button>

            {order.status !== "shipped" && order.status !== "delivered" && (
              <button
                onClick={() => onOpenDispatch(order)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#E72A52] hover:bg-[#B12642] py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-standard"
              >
                <Truck className="h-4 w-4" /> Mark as Dispatched
              </button>
            )}

            {order.status === "shipped" && (
              <button
                onClick={() => updateOrderStatus(order.id, "delivered")}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-standard"
              >
                <CheckCircle2 className="h-4 w-4" /> Confirm Delivered
              </button>
            )}
          </div>

          {/* Customer & Shipping Destination */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900">Customer & Shipping Details</span>
              <span className="text-[11px] text-slate-500 font-mono">
                Payment: {order.paymentMethod}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900">{order.customerName}</div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="h-3.5 w-3.5 text-slate-400" /> {order.customerEmail}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="h-3.5 w-3.5 text-slate-400" /> {order.customerPhone}
              </div>
              <div className="flex items-start gap-2 text-slate-600 pt-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <div>{order.shippingAddress.street}</div>
                  <div className="font-semibold text-slate-800">
                    {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country}
                  </div>
                </div>
              </div>
            </div>

            {order.courier && (
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg">
                <div>
                  <span className="text-slate-500 text-[10px] block">Assigned Courier</span>
                  <span className="font-bold text-slate-900">{order.courier}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[10px] block">Airway Bill / Tracking</span>
                  <span className="font-mono font-bold text-[#B12642]">{order.trackingNumber}</span>
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <span className="text-xs font-bold text-slate-900 block border-b border-slate-100 pb-2">
              Ordered Items ({order.items.length})
            </span>

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-100 bg-slate-50/60 p-3 space-y-2"
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {item.title}
                        </span>
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {formatNaira(item.price * item.quantity)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span className="font-mono">SKU: {item.sku}</span>
                        {item.variantName && <span>• {item.variantName}</span>}
                        <span>• Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Digital Reissue Link Action */}
                  {item.type === "digital" && (
                    <div className="mt-2 pt-2 border-t border-slate-200 flex flex-col gap-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#12597f] flex items-center gap-1">
                          <Music className="h-3.5 w-3.5" /> Digital Asset License
                        </span>
                        <button
                          onClick={() => handleReissue(item.productId)}
                          className="flex items-center gap-1 text-[11px] font-bold text-[#E72A52] hover:text-[#111111]"
                        >
                          <RefreshCw className="h-3 w-3" /> Re-issue Fresh Download Link
                        </button>
                      </div>

                      {item.digitalDownloadUrl && (
                        <div className="flex items-center gap-2 bg-white rounded p-1.5 border border-slate-200 text-[10px] font-mono">
                          <span className="truncate flex-1 text-slate-600">
                            {item.digitalDownloadUrl}
                          </span>
                          <button
                            onClick={() => handleCopyLink(item.digitalDownloadUrl!)}
                            className="text-[#E72A52] hover:text-[#111111] shrink-0 font-sans font-semibold flex items-center gap-0.5"
                          >
                            {copiedLink === item.digitalDownloadUrl ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            {copiedLink === item.digitalDownloadUrl ? "Copied" : "Copy"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">{formatNaira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Courier Shipping Fee:</span>
                <span className="font-mono font-medium">{formatNaira(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>FameMe Platform Fee:</span>
                <span className="font-mono font-medium">- {formatNaira(order.commissionFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
                <span>Net Seller Payout:</span>
                <span className="font-mono text-emerald-700 font-extrabold">
                  {formatNaira(order.netPayout)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

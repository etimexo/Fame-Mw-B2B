"use client";

import React, { useState } from "react";
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  Save,
  RotateCcw,
  Plus,
  Minus,
  History,
  Package,
  ArrowRight,
  TrendingDown,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { formatNaira, formatDateTime } from "@/lib/utils";

export default function InventoryConsole() {
  const { products, updateStock, batchUpdateStock, inventoryLogs } = useDashboard();

  // Only physical products have stock management
  const physicalProducts = products.filter((p) => p.type === "physical");

  // Local state for inline editable stock values
  const [stockValues, setStockValues] = useState<{ [productId: string]: number }>(() => {
    const initial: { [key: string]: number } = {};
    physicalProducts.forEach((p) => {
      initial[p.id] = p.stock;
    });
    return initial;
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  const handleStockChange = (productId: string, val: number) => {
    const safeVal = Math.max(0, val);
    setStockValues((prev) => ({ ...prev, [productId]: safeVal }));
    setHasChanges(true);
  };

  const handleQuickAdjust = (productId: string, delta: number) => {
    const current = stockValues[productId] !== undefined ? stockValues[productId] : 0;
    const newVal = Math.max(0, current + delta);
    handleStockChange(productId, newVal);
  };

  const handleSaveAll = () => {
    const updates = Object.entries(stockValues).map(([productId, newStock]) => ({
      productId,
      newStock,
    }));

    batchUpdateStock(updates, "Batch inventory count audit save");
    setHasChanges(false);
    setSuccessToast("All physical stock quantities saved and logged to audit trail!");
    setTimeout(() => setSuccessToast(""), 3500);
  };

  const handleReset = () => {
    const initial: { [key: string]: number } = {};
    physicalProducts.forEach((p) => {
      initial[p.id] = p.stock;
    });
    setStockValues(initial);
    setHasChanges(false);
  };

  const outOfStockItems = physicalProducts.filter((p) => p.stock === 0);
  const lowStockItems = physicalProducts.filter(
    (p) => p.stock > 0 && p.stock <= p.lowStockThreshold
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Physical Warehouse & Inventory Control
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quick inline batch stock updater, replenishment thresholds, and change logs.
          </p>
        </div>

        {hasChanges && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <RotateCcw className="h-4 w-4 text-slate-400" /> Discard
            </button>
            <button
              onClick={handleSaveAll}
              className="flex items-center gap-1.5 rounded-xl bg-[#E72A52] hover:bg-[#B12642] px-4 py-2 text-xs font-bold text-white shadow-xs transition-standard animate-pulse"
            >
              <Save className="h-4 w-4" /> Save Batch Changes
            </button>
          </div>
        )}
      </div>

      {successToast && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Stock Warnings Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Out of Stock Emergency */}
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-red-900">
              <AlertTriangle className="h-4 w-4 text-red-600" /> Out of Stock Emergency
            </span>
            <span className="rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-[10px] font-bold">
              {outOfStockItems.length} Products
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600">
            {outOfStockItems.length > 0 ? (
              <ul className="space-y-1 mt-1">
                {outOfStockItems.map((p) => (
                  <li key={p.id} className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                    {p.title} (SKU: {p.sku})
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-emerald-700 font-semibold">No out-of-stock items.</span>
            )}
          </div>
        </div>

        {/* Low Stock Warnings */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <TrendingDown className="h-4 w-4 text-amber-600" /> Low Stock Watchlist (&lt; 5 units)
            </span>
            <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-[10px] font-bold">
              {lowStockItems.length} Products
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600">
            {lowStockItems.length > 0 ? (
              <ul className="space-y-1 mt-1">
                {lowStockItems.map((p) => (
                  <li key={p.id} className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                    {p.title} • <strong className="text-amber-800">{p.stock} units left</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-emerald-700 font-semibold">All inventory above safety thresholds.</span>
            )}
          </div>
        </div>
      </div>

      {/* Inline Editable Inventory Table */}
      <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Live Stock Console & Quick Stepper
            </h3>
            <p className="text-xs text-slate-500">
              Click +/- or type quantity directly into the field to update warehouse inventory.
            </p>
          </div>
          {hasChanges && (
            <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-xs font-bold animate-pulse">
              Unsaved Changes
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 pl-4">Physical Merchandise</th>
                <th className="py-3.5">SKU & Barcode</th>
                <th className="py-3.5">Retail Price</th>
                <th className="py-3.5 text-center">Safety Threshold</th>
                <th className="py-3.5 text-center">Live Units (Editable)</th>
                <th className="py-3.5 pr-4 text-right">Quick Step Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {physicalProducts.map((p) => {
                const currentVal =
                  stockValues[p.id] !== undefined ? stockValues[p.id] : p.stock;
                const isModified = currentVal !== p.stock;
                const isLow = currentVal <= p.lowStockThreshold && currentVal > 0;
                const isOut = currentVal === 0;

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-slate-50/80 transition-standard ${
                      isModified ? "bg-[#E72A52]/10/20" : ""
                    }`}
                  >
                    <td className="py-3.5 pl-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="h-10 w-10 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div className="max-w-xs">
                          <span className="font-bold text-slate-900 block truncate">
                            {p.title}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {p.category} • {p.weightKg || 0.5} kg
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 font-mono text-slate-700">
                      <div>{p.sku}</div>
                      {p.barcode && (
                        <div className="text-[10px] text-slate-400">EAN: {p.barcode}</div>
                      )}
                    </td>

                    <td className="py-3.5 font-mono font-bold text-slate-900">
                      {formatNaira(p.price)}
                    </td>

                    <td className="py-3.5 text-center font-mono text-slate-500">
                      {p.lowStockThreshold} units
                    </td>

                    {/* Inline Stock Input */}
                    <td className="py-3.5 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <input
                          type="number"
                          min={0}
                          value={currentVal}
                          onChange={(e) => handleStockChange(p.id, Number(e.target.value))}
                          className={`w-20 h-9 rounded-lg border text-center font-mono font-bold text-sm focus:outline-none focus:ring-2 ${
                            isOut
                              ? "border-red-300 bg-red-50 text-red-700 focus:ring-red-500/20"
                              : isLow
                              ? "border-amber-300 bg-amber-50 text-amber-800 focus:ring-amber-500/20"
                              : "border-slate-300 bg-white text-slate-900 focus:ring-[#E72A52]/20"
                          } ${isModified ? "ring-2 ring-[#E72A52]/30 font-black" : ""}`}
                        />
                        {isModified && (
                          <span className="text-[10px] font-bold text-[#E72A52]">
                            *modified
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Quick Step Buttons */}
                    <td className="py-3.5 pr-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(p.id, -5)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100"
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(p.id, -1)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(p.id, 1)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(p.id, 10)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Adjustment Audit Trail */}
      <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white shadow-xs p-5 sm:p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-[#E72A52]" />
            <h3 className="text-sm font-bold text-slate-900">
              Inventory Adjustment Audit Log
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Immutable log of stock additions and fulfillment deductions
          </span>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {inventoryLogs.map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900">{log.productTitle}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Reason: <strong>{log.reason}</strong> • By {log.changedBy}
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-mono font-bold text-xs ${
                    log.change >= 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {log.change >= 0 ? `+${log.change}` : log.change} units
                </span>
                <div className="text-[10px] text-slate-400">
                  {log.previousStock} → {log.newStock} units • {formatDateTime(log.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

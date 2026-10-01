"use client";

import React, { useState } from "react";
import {
  ShoppingCart,
  Search,
  Filter,
  Truck,
  Printer,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Eye,
  FileText,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { Order, OrderStatus } from "@/types";
import { formatNaira, formatDateTime } from "@/lib/utils";
import OrderDetailDrawer from "./OrderDetailDrawer";
import WaybillModal from "./WaybillModal";
import DispatchModal from "./DispatchModal";

type TabFilter = "all" | OrderStatus;

export default function OrderPipeline() {
  const { orders } = useDashboard();

  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourier, setSelectedCourier] = useState<string>("all");

  // Modals & Drawer State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [waybillOrder, setWaybillOrder] = useState<Order | null>(null);
  const [isWaybillOpen, setIsWaybillOpen] = useState(false);
  const [dispatchOrder, setDispatchOrder] = useState<Order | null>(null);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);

  const tabs: { key: TabFilter; label: string }[] = [
    { key: "all", label: "All Orders" },
    { key: "new", label: "New" },
    { key: "processing", label: "Processing" },
    { key: "awaiting_fulfillment", label: "Awaiting Fulfillment" },
    { key: "ready_for_dispatch", label: "Ready for Dispatch" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
    { key: "returned", label: "Returned" },
    { key: "disputed", label: "Disputed" },
  ];

  const filteredOrders = orders.filter((o) => {
    if (activeTab !== "all" && o.status !== activeTab) return false;
    if (selectedCourier !== "all") {
      if (selectedCourier === "unassigned" && o.courier) return false;
      if (selectedCourier !== "unassigned" && !o.courier?.includes(selectedCourier)) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchOrder = o.orderNumber.toLowerCase().includes(q);
      const matchCustomer = o.customerName.toLowerCase().includes(q);
      const matchTracking = o.trackingNumber?.toLowerCase().includes(q);
      const matchCity = o.shippingAddress.city.toLowerCase().includes(q);
      if (!matchOrder && !matchCustomer && !matchTracking && !matchCity) return false;
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "new":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "processing":
        return "bg-[#E72A52]/10 text-[#B12642] border-[#E72A52]/30";
      case "awaiting_fulfillment":
        return "bg-amber-50 text-amber-800 border-amber-200 font-bold";
      case "ready_for_dispatch":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "shipped":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-slate-100 text-slate-600 border-slate-200";
      case "disputed":
        return "bg-rose-50 text-rose-700 border-rose-200 font-bold";
      case "returned":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const handleOpenDrawer = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const handleOpenWaybillModal = (order: Order) => {
    setWaybillOrder(order);
    setIsWaybillOpen(true);
  };

  const handleOpenDispatchModal = (order: Order) => {
    setDispatchOrder(order);
    setIsDispatchOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Order Fulfillment & Logistics Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor shipments, generate Nigerian courier waybills, and re-issue digital tokens.
          </p>
        </div>
      </div>

      {/* Pipeline Status Horizontal Tabs */}
      <div className="overflow-x-auto border-b border-slate-200 bg-white rounded-xl shadow-2xs">
        <div className="flex gap-1 p-2 min-w-max">
          {tabs.map((tab) => {
            const count =
              tab.key === "all"
                ? orders.length
                : orders.filter((o) => o.status === tab.key).length;

            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-standard ${
                  isActive
                    ? "bg-gradient-to-r from-[#E72A52] to-[#B12642] text-white shadow-xs font-black"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive ? "bg-white/25 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search order #, customer, tracking..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCourier}
            onChange={(e) => setSelectedCourier(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
          >
            <option value="all">All Couriers / Transit</option>
            <option value="GIG">GIG Logistics</option>
            <option value="DHL">DHL Express</option>
            <option value="Kwik">Kwik Delivery</option>
            <option value="Speedaf">Speedaf Nigeria</option>
            <option value="unassigned">Awaiting Assignment</option>
          </select>

          <span className="text-xs text-slate-400">
            Showing {filteredOrders.length} orders
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 pl-4">Order Ref</th>
                <th className="py-3.5">Customer & City</th>
                <th className="py-3.5">Items Ordered</th>
                <th className="py-3.5">Gross Subtotal</th>
                <th className="py-3.5">Courier & Tracking</th>
                <th className="py-3.5">Pipeline Status</th>
                <th className="py-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const badgeClass = getStatusBadge(order.status);
                  const firstItem = order.items[0];

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/80 transition-standard cursor-pointer"
                      onClick={() => handleOpenDrawer(order)}
                    >
                      <td className="py-3.5 pl-4">
                        <div className="font-mono font-bold text-slate-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {formatDateTime(order.createdAt)}
                        </div>
                      </td>

                      <td className="py-3.5">
                        <div className="font-bold text-slate-900">{order.customerName}</div>
                        <div className="text-[11px] text-slate-500">
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </div>
                      </td>

                      <td className="py-3.5">
                        <div className="flex items-center gap-2 max-w-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={firstItem.imageUrl}
                            alt={firstItem.title}
                            className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div className="truncate">
                            <span className="font-medium text-slate-800 truncate block">
                              {firstItem.title}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {order.items.length > 1
                                ? `+${order.items.length - 1} more items`
                                : `Qty: ${firstItem.quantity} • ${firstItem.type.toUpperCase()}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 font-mono">
                        <div className="font-bold text-slate-900">
                          {formatNaira(order.subtotal)}
                        </div>
                        <div className="text-[10px] font-sans text-slate-400">
                          Net: {formatNaira(order.netPayout)}
                        </div>
                      </td>

                      <td className="py-3.5">
                        {order.courier ? (
                          <div>
                            <div className="font-semibold text-slate-800">{order.courier}</div>
                            <div className="font-mono text-[10px] text-[#B12642]">
                              {order.trackingNumber}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${badgeClass}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {order.status.replace(/_/g, " ").toUpperCase()}
                        </span>
                      </td>

                      <td
                        className="py-3.5 pr-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenWaybillModal(order)}
                            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 hover:text-[#E72A52] transition-standard"
                            title="Print Waybill Label"
                          >
                            <Printer className="h-4 w-4" />
                          </button>

                          {order.status !== "shipped" && order.status !== "delivered" && (
                            <button
                              onClick={() => handleOpenDispatchModal(order)}
                              className="rounded-lg p-1.5 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-standard"
                              title="Mark as Dispatched"
                            >
                              <Truck className="h-4 w-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenDrawer(order)}
                            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 transition-standard"
                            title="View Order Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <ShoppingCart className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No orders found in this status</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Check other pipeline stages or adjust your filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer and Modals */}
      <OrderDetailDrawer
        order={selectedOrder}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenWaybill={(order) => {
          setIsDrawerOpen(false);
          handleOpenWaybillModal(order);
        }}
        onOpenDispatch={(order) => {
          setIsDrawerOpen(false);
          handleOpenDispatchModal(order);
        }}
      />

      <WaybillModal
        order={waybillOrder}
        isOpen={isWaybillOpen}
        onClose={() => setIsWaybillOpen(false)}
      />

      <DispatchModal
        order={dispatchOrder}
        isOpen={isDispatchOpen}
        onClose={() => setIsDispatchOpen(false)}
      />
    </div>
  );
}

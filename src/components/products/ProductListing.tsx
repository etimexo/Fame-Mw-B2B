"use client";

import React, { useState } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  ExternalLink,
  Music,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  Copy,
  Tag,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { Product, ProductType, ApprovalStatus, ProductStatus } from "@/types";
import { formatNaira, formatDate } from "@/lib/utils";
import ProductModal from "./ProductModal";

export default function ProductListing() {
  const { products, deleteProduct, addProduct } = useDashboard();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedApproval, setSelectedApproval] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (selectedType !== "all" && p.type !== selectedType) return false;
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    if (selectedApproval !== "all" && p.approvalStatus !== selectedApproval) return false;
    if (selectedStatus !== "all" && p.status !== selectedStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSku && !matchTags) return false;
    }
    return true;
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const handleDuplicate = (p: Product) => {
    const copyTitle = `${p.title} (Copy)`;
    const copySku = `${p.sku}-CPY`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, ...rest } = p;
    addProduct({
      ...rest,
      title: copyTitle,
      sku: copySku,
      status: "draft",
    });
  };

  const getApprovalBadge = (status: ApprovalStatus) => {
    switch (status) {
      case "approved":
        return {
          label: "Approved",
          icon: CheckCircle2,
          class: "bg-[#15803D]/15 text-[#15803D] border-[#15803D]/30",
        };
      case "under_review":
        return {
          label: "Under Review",
          icon: Clock,
          class: "bg-[#E7DFA6]/40 text-[#605510] border-[#E7DFA6]/60",
        };
      case "rejected":
        return {
          label: "Rejected",
          icon: XCircle,
          class: "bg-[#E7000B]/15 text-[#E7000B] border-[#E7000B]/30",
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Product & Digital Asset Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage physical tour merchandise, vinyl pressings, sample packs, and music stems.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#E72A52] to-[#B12642] hover:opacity-95 px-5 py-2.5 text-xs font-black text-white shadow-sm transition-standard"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, SKU, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
            />
          </div>

          {/* Selectors */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Product Type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
            >
              <option value="all">All Types (Physical & Digital)</option>
              <option value="physical">Physical Merchandise</option>
              <option value="digital">Digital Assets & Stems</option>
            </select>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Approval Status */}
            <select
              value={selectedApproval}
              onChange={(e) => setSelectedApproval(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
            >
              <option value="all">All Approval States</option>
              <option value="approved">Approved</option>
              <option value="under_review">Under Review</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
            >
              <option value="all">All Listing Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Filter count summary */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong>{filteredProducts.length}</strong> of {products.length} products
          </span>
          {(selectedType !== "all" ||
            selectedCategory !== "all" ||
            selectedApproval !== "all" ||
            selectedStatus !== "all" ||
            searchQuery) && (
            <button
              onClick={() => {
                setSelectedType("all");
                setSelectedCategory("all");
                setSelectedApproval("all");
                setSelectedStatus("all");
                setSearchQuery("");
              }}
              className="text-[#E72A52] font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-4 pl-5">Product Details</th>
                <th className="py-3.5">Category & Type</th>
                <th className="py-3.5">SKU / Asset ID</th>
                <th className="py-3.5">Retail Price</th>
                <th className="py-3.5">Stock Level</th>
                <th className="py-3.5">Admin Approval</th>
                <th className="py-3.5">Status</th>
                <th className="py-4 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const approval = getApprovalBadge(p.approvalStatus);
                  const ApprovalIcon = approval.icon;

                  const isLowStock =
                    p.type === "physical" && p.stock <= p.lowStockThreshold && p.stock > 0;
                  const isOutOfStock = p.type === "physical" && p.stock === 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-standard">
                      {/* Product Details */}
                      <td className="py-4 pl-5">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="h-11 w-11 rounded-xl object-cover ring-1 ring-slate-200 shadow-2xs shrink-0"
                          />
                          <div className="max-w-xs min-w-0">
                            <span className="font-bold text-slate-900 line-clamp-1">
                              {p.title}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {p.type === "physical" ? (
                                <span className="inline-flex items-center gap-1 rounded bg-[#E72A52]/10 px-1.5 py-0.2 text-[9px] font-bold text-[#B12642]">
                                  <Package className="h-3 w-3" /> PHYSICAL
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded bg-[#82C7EF]/15 px-1.5 py-0.2 text-[9px] font-bold text-[#12597f]">
                                  <Music className="h-3 w-3" /> DIGITAL ({p.digitalFileSize})
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400">
                                Added {formatDate(p.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3">
                        <div className="font-semibold text-slate-800">{p.category}</div>
                        <div className="text-[11px] text-slate-500">{p.subcategory}</div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 font-mono font-medium text-slate-700">
                        <div>{p.sku}</div>
                        {p.barcode && (
                          <div className="text-[10px] text-slate-400">EAN: {p.barcode}</div>
                        )}
                      </td>

                      {/* Price */}
                      <td className="py-3 font-mono">
                        {p.salePrice ? (
                          <div>
                            <span className="font-bold text-slate-900">
                              {formatNaira(p.salePrice)}
                            </span>
                            <span className="ml-1 text-[11px] text-slate-400 line-through">
                              {formatNaira(p.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-slate-900">{formatNaira(p.price)}</span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3 font-mono">
                        {p.type === "digital" ? (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                            Unlimited Digital
                          </span>
                        ) : isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-bold text-red-700">
                            <AlertTriangle className="h-3 w-3" /> Out of Stock (0)
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                            <AlertTriangle className="h-3 w-3" /> Low ({p.stock} left)
                          </span>
                        ) : (
                          <span className="font-semibold text-slate-800">
                            {p.stock} units
                          </span>
                        )}
                      </td>

                      {/* Approval Status */}
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${approval.class}`}
                        >
                          <ApprovalIcon className="h-3 w-3" />
                          {approval.label}
                        </span>
                      </td>

                      {/* Publication Status */}
                      <td className="py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            p.status === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : p.status === "draft"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsModalOpen(true);
                            }}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-[#E72A52] transition-standard"
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDuplicate(p)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-[#E72A52] transition-standard"
                            title="Duplicate Product"
                          >
                            <Copy className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-standard"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Package className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No products match your filter</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting the search criteria or add a new listing.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Create/Edit Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        productToEdit={editingProduct}
      />
    </div>
  );
}

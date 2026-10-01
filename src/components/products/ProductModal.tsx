"use client";

import React, { useState } from "react";
import {
  X,
  Upload,
  Sparkles,
  Package,
  Music,
  CheckCircle,
  HelpCircle,
  Plus,
  Trash2,
  DollarSign,
  Layers,
  FileAudio,
} from "lucide-react";
import { Product, ProductType, ApprovalStatus, ProductStatus } from "@/types";
import { useDashboard } from "@/context/DashboardContext";
import { formatNaira } from "@/lib/utils";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export default function ProductModal({ isOpen, onClose, productToEdit }: ProductModalProps) {
  const { addProduct, updateProduct, profile } = useDashboard();

  const [activeTab, setActiveTab] = useState<"general" | "pricing" | "attributes">("general");

  // Form State
  const [title, setTitle] = useState(productToEdit?.title || "");
  const [description, setDescription] = useState(productToEdit?.description || "");
  const [category, setCategory] = useState(productToEdit?.category || "Apparel & Merchandise");
  const [subcategory, setSubcategory] = useState(productToEdit?.subcategory || "Hoodies & Sweatshirts");
  const [type, setType] = useState<ProductType>(productToEdit?.type || "physical");
  const [sku, setSku] = useState(productToEdit?.sku || "FM-PROD-" + Math.floor(100 + Math.random() * 900));
  const [barcode, setBarcode] = useState(productToEdit?.barcode || "6159200" + Math.floor(10000 + Math.random() * 90000));
  const [price, setPrice] = useState<number>(productToEdit?.price || 35000);
  const [salePrice, setSalePrice] = useState<number | undefined>(productToEdit?.salePrice);
  const [stock, setStock] = useState<number>(productToEdit?.stock || 25);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(productToEdit?.lowStockThreshold || 5);
  const [imageUrl, setImageUrl] = useState(
    productToEdit?.imageUrl ||
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80"
  );
  const [status, setStatus] = useState<ProductStatus>(productToEdit?.status || "active");
  const [tags, setTags] = useState<string>(productToEdit?.tags.join(", ") || "afrobeats, merch, modern");

  // Physical Attributes
  const [weightKg, setWeightKg] = useState<number>(productToEdit?.weightKg || 0.85);
  const [dimensions, setDimensions] = useState(
    productToEdit?.dimensionsCm || { length: 30, width: 25, height: 6 }
  );

  // Digital Attributes
  const [digitalFileFormat, setDigitalFileFormat] = useState(
    productToEdit?.digitalFileFormat || "ZIP (24-bit 44.1kHz WAV)"
  );
  const [digitalFileSize, setDigitalFileSize] = useState(productToEdit?.digitalFileSize || "1.2 GB");
  const [digitalDownloadLimit, setDigitalDownloadLimit] = useState(
    productToEdit?.digitalDownloadLimit || 5
  );
  const [licenseType, setLicenseType] = useState<"standard" | "extended_commercial" | "exclusive_rights">(
    productToEdit?.licenseType || "extended_commercial"
  );

  if (!isOpen) return null;

  // Commission calculations
  const effectivePrice = salePrice && salePrice > 0 ? salePrice : price;
  const commissionRate = profile.commissionRate;
  const estimatedCommission = effectivePrice * commissionRate;
  const estimatedNet = effectivePrice - estimatedCommission;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
      title,
      description,
      category,
      subcategory,
      type,
      sku,
      barcode: type === "physical" ? barcode : undefined,
      price: Number(price),
      salePrice: salePrice && Number(salePrice) > 0 ? Number(salePrice) : undefined,
      stock: type === "digital" ? 9999 : Number(stock),
      lowStockThreshold: type === "digital" ? 0 : Number(lowStockThreshold),
      approvalStatus: productToEdit ? productToEdit.approvalStatus : "approved",
      status,
      imageUrl,
      tags: parsedTags,
      ...(type === "physical"
        ? {
            weightKg: Number(weightKg),
            dimensionsCm: dimensions,
          }
        : {
            digitalFileFormat,
            digitalFileSize,
            digitalDownloadLimit: Number(digitalDownloadLimit),
            licenseType,
          }),
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, payload);
    } else {
      addProduct(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E72A52]/10 text-[#E72A52]">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {productToEdit ? "Edit Product Listing" : "Create New Product Listing"}
              </h2>
              <p className="text-xs text-slate-500">
                Configure listing details, pricing, variants, and courier/digital assets.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-6 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`border-b-2 py-3 px-4 text-xs font-bold transition-standard ${
              activeTab === "general"
                ? "border-[#E72A52] text-[#E72A52]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            1. General Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pricing")}
            className={`border-b-2 py-3 px-4 text-xs font-bold transition-standard ${
              activeTab === "pricing"
                ? "border-[#E72A52] text-[#E72A52]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            2. Pricing & FameMe Net
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("attributes")}
            className={`border-b-2 py-3 px-4 text-xs font-bold transition-standard ${
              activeTab === "attributes"
                ? "border-[#E72A52] text-[#E72A52]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            3. {type === "physical" ? "Physical & Courier Specs" : "Digital Asset Delivery"}
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5">
            {/* TAB 1: General Details */}
            {activeTab === "general" && (
              <div className="space-y-4">
                {/* Product Type Toggle */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Product Classification *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setType("physical")}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-standard ${
                        type === "physical"
                          ? "border-[#E72A52] bg-[#E72A52]/10/50 ring-1 ring-indigo-600"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#82C7EF]/20 text-[#E72A52]">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Physical Merchandise</div>
                        <div className="text-[11px] text-slate-500">Apparel, Vinyl LPs, hardcovers, instruments</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setType("digital")}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-standard ${
                        type === "digital"
                          ? "border-violet-600 bg-[#82C7EF]/15/50 ring-1 ring-violet-600"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#82C7EF]/20 text-[#E72A52]">
                        <Music className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Digital Asset</div>
                        <div className="text-[11px] text-slate-500">Music stems, sample kits, audiobooks, art</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., FameMe Classic Heavyweight Tour Hoodie (Black/Violet)"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20 focus:border-[#E72A52]"
                  />
                </div>

                {/* Categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Primary Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                    >
                      <option value="Apparel & Merchandise">Apparel & Merchandise</option>
                      <option value="Music & Records">Music & Records (Vinyl/CDs)</option>
                      <option value="Music & Digital Audio">Music & Digital Audio</option>
                      <option value="Books & Publications">Books & Publications</option>
                      <option value="Musical Instruments">Musical Instruments</option>
                      <option value="Digital Assets & FX">Digital Assets & FX</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Subcategory
                    </label>
                    <input
                      type="text"
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      placeholder="e.g. Hoodies, Sample Packs, Drumsticks"
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide detailed material specifications, track listings, stem format details..."
                    className="w-full p-3 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                  />
                </div>

                {/* Image Dropzone Mock */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Featured Media Preview URL
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="h-10 w-10 rounded-lg object-cover ring-1 ring-slate-200"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Search Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="afrobeats, drum kit, merch, lagos"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Pricing & Commission Calculator */}
            {activeTab === "pricing" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Regular Retail Price (NGN ₦) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        ₦
                      </span>
                      <input
                        type="number"
                        required
                        min={500}
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full h-10 pl-8 pr-3 rounded-lg border border-slate-200 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Promotional / Sale Price (NGN ₦)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        ₦
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={salePrice || ""}
                        onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="Leave blank if no discount"
                        className="w-full h-10 pl-8 pr-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Commission Simulator Card */}
                <div className="rounded-xl border border-[#E72A52]/30 bg-gradient-to-br from-[#E7DFA6]/20/70 via-white to-[#82C7EF]/15/70 p-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#CCCCCC]/40">
                    <span className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-[#E72A52]" />
                      FameMe Settlement Net Calculator
                    </span>
                    <span className="rounded bg-[#82C7EF]/20 px-2 py-0.5 text-[10px] font-extrabold text-[#B12642]">
                      {(commissionRate * 100).toFixed(0)}% TAKE-RATE
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-white p-2.5 shadow-2xs border border-slate-100">
                      <div className="text-[10px] text-slate-500">Customer Pays</div>
                      <div className="text-sm font-black font-mono text-slate-900 mt-1">
                        {formatNaira(effectivePrice)}
                      </div>
                    </div>

                    <div className="rounded-lg bg-white p-2.5 shadow-2xs border border-slate-100">
                      <div className="text-[10px] text-slate-500">FameMe Fee ({(commissionRate * 100)}%)</div>
                      <div className="text-sm font-black font-mono text-rose-600 mt-1">
                        - {formatNaira(estimatedCommission)}
                      </div>
                    </div>

                    <div className="rounded-lg bg-emerald-50/80 p-2.5 shadow-2xs border border-emerald-100">
                      <div className="text-[10px] text-emerald-800 font-semibold">Your Estimated Payout</div>
                      <div className="text-sm font-black font-mono text-emerald-700 mt-1">
                        {formatNaira(estimatedNet)}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                    * Net earnings enter your Escrow Balance immediately upon successful checkout and are released to Withdrawable Balance upon delivery confirmation.
                  </p>
                </div>

                {/* Listing Status */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Publication Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProductStatus)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                  >
                    <option value="active">Active (Visible in Marketplace)</option>
                    <option value="draft">Draft (Hidden from Marketplace)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            )}

            {/* TAB 3: Attributes (Physical vs Digital) */}
            {activeTab === "attributes" && (
              <div className="space-y-4">
                {type === "physical" ? (
                  /* Physical Specifications */
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          SKU (Stock Keeping Unit) *
                        </label>
                        <input
                          type="text"
                          required
                          value={sku}
                          onChange={(e) => setSku(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Barcode / EAN-13
                        </label>
                        <input
                          type="text"
                          value={barcode}
                          onChange={(e) => setBarcode(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Physical Stock Quantity *
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={stock}
                          onChange={(e) => setStock(Number(e.target.value))}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Low Stock Alert Threshold
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={lowStockThreshold}
                          onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                        />
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                      <div className="text-xs font-bold text-slate-900 mb-2">
                        Courier Package Dimensions (For GIG/DHL Rate Calculation)
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-1">Weight (kg)</label>
                          <input
                            type="number"
                            step="0.05"
                            value={weightKg}
                            onChange={(e) => setWeightKg(Number(e.target.value))}
                            className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-1">L (cm)</label>
                          <input
                            type="number"
                            value={dimensions.length}
                            onChange={(e) =>
                              setDimensions({ ...dimensions, length: Number(e.target.value) })
                            }
                            className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-1">W (cm)</label>
                          <input
                            type="number"
                            value={dimensions.width}
                            onChange={(e) =>
                              setDimensions({ ...dimensions, width: Number(e.target.value) })
                            }
                            className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-1">H (cm)</label>
                          <input
                            type="number"
                            value={dimensions.height}
                            onChange={(e) =>
                              setDimensions({ ...dimensions, height: Number(e.target.value) })
                            }
                            className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Digital Asset Specifications */
                  <>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Master File Format
                      </label>
                      <input
                        type="text"
                        value={digitalFileFormat}
                        onChange={(e) => setDigitalFileFormat(e.target.value)}
                        placeholder="e.g. ZIP archive containing WAV 24-bit 48kHz, MP3 & MIDI stems"
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          File Package Size
                        </label>
                        <input
                          type="text"
                          value={digitalFileSize}
                          onChange={(e) => setDigitalFileSize(e.target.value)}
                          placeholder="e.g. 1.45 GB"
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Max Download Limit Per Purchase
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={digitalDownloadLimit}
                          onChange={(e) => setDigitalDownloadLimit(Number(e.target.value))}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Commercial Licensing Agreement
                      </label>
                      <select
                        value={licenseType}
                        onChange={(e) =>
                          setLicenseType(
                            e.target.value as "standard" | "extended_commercial" | "exclusive_rights"
                          )
                        }
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                      >
                        <option value="standard">Standard License (Non-profit & Stream use)</option>
                        <option value="extended_commercial">
                          Extended Commercial (Monetized Streaming & Broadcast)
                        </option>
                        <option value="exclusive_rights">Exclusive Rights (Full IP Buyout)</option>
                      </select>
                    </div>

                    <div className="rounded-xl border border-[#82C7EF]/40 bg-[#82C7EF]/15/50 p-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-violet-900">
                        <FileAudio className="h-4 w-4 text-[#E72A52]" />
                        Automated Instant Digital Delivery
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Upon confirmed card/transfer payment on FameMe, customer is securely provisioned a tokenized high-speed download link with 7-day expiration.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-standard"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {activeTab !== "general" && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(activeTab === "attributes" ? "pricing" : "general")
                  }
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-standard"
                >
                  ← Back
                </button>
              )}

              {activeTab !== "attributes" ? (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(activeTab === "general" ? "pricing" : "attributes")
                  }
                  className="rounded-lg bg-[#E72A52] hover:bg-[#B12642] px-4 py-2 text-xs font-bold text-white shadow-xs transition-standard"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  className="rounded-lg bg-[#E72A52] hover:bg-[#B12642] px-5 py-2 text-xs font-bold text-white shadow-xs transition-standard"
                >
                  {productToEdit ? "Save Product Changes" : "Publish Product Listing"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

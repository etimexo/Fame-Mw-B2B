"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  MapPin,
  Users,
  Repeat,
  Package,
  Music,
  ArrowUpRight,
  Sparkles,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { formatNaira } from "@/lib/utils";

export default function AnalyticsView() {
  const { products, orders, balances } = useDashboard();
  const [timeRange, setTimeRange] = useState("30d");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Leaderboard ranking
  const productPerformance = [
    {
      id: "1",
      title: "FameMe Classic Heavyweight Tour Hoodie (Che Guevara Red Crest)",
      category: "Apparel & Merchandise",
      type: "physical",
      unitsSold: 64,
      revenue: 3104000,
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "2",
      title: "Afro-Fusion Drum & Percussion Stem Pack",
      category: "Music & Digital Audio",
      type: "digital",
      unitsSold: 88,
      revenue: 2112000,
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "3",
      title: "Lagos Afrobeat Vinyl LP Deluxe Edition",
      category: "Music & Records",
      type: "physical",
      unitsSold: 46,
      revenue: 1610000,
      image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "4",
      title: "The Sound of Eko: Sample Library",
      category: "Music & Digital Audio",
      type: "digital",
      unitsSold: 42,
      revenue: 1218000,
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "5",
      title: "Naija Renaissance Hardcover Photobook",
      category: "Books & Publications",
      type: "physical",
      unitsSold: 31,
      revenue: 992000,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80",
    },
  ];

  // Regional breakdown with distinct brand colors
  const regionalDistribution = [
    { region: "Lagos State (Island & Mainland)", percentage: 56, orders: 128, revenue: 5640000, color: "#E72A52" },
    { region: "Abuja (FCT)", percentage: 22, orders: 48, revenue: 2280000, color: "#82C7EF" },
    { region: "Port Harcourt (Rivers State)", percentage: 11, orders: 24, revenue: 1120000, color: "#BCD025" },
    { region: "Kano & Kaduna (Northern Region)", percentage: 6, orders: 14, revenue: 640000, color: "#55751E" },
    { region: "International (Accra, London, Atlanta)", percentage: 5, orders: 11, revenue: 580000, color: "#B12642" },
  ];

  const handleExportAnalytics = () => {
    const csvContent =
      "Category,Item,Classification,Units Sold,Revenue (NGN)\n" +
      productPerformance
        .map(
          (p) =>
            `"${p.category}","${p.title}","${p.type}",${p.unitsSold},${p.revenue}`
        )
        .join("\n") +
      "\n\nRegion,Percentage,Orders,Revenue (NGN)\n" +
      regionalDistribution
        .map(
          (r) =>
            `"${r.region}",${r.percentage}%,${r.orders},${r.revenue}`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `fameme-analytics-report-${timeRange}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
            Sales Intelligence & Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Cohort retention, top merchandise leaderboard, and regional courier delivery mapping.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="h-10 rounded-xl border border-[#CCCCCC]/50 bg-white px-3.5 text-xs font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days (MTD)</option>
            <option value="90d">Last Quarter</option>
            <option value="1y">Year to Date 2026</option>
          </select>

          <button
            onClick={handleExportAnalytics}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#E72A52] to-[#B12642] hover:opacity-95 px-4 py-2.5 text-xs font-black text-white shadow-sm transition-standard"
          >
            <Download className="h-4 w-4" /> Export Report CSV
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="rounded-2xl border border-[#15803D]/30 bg-[#15803D]/10 p-4 text-xs font-bold text-[#15803D] flex items-center justify-between animate-in fade-in">
          <span>✓ Analytics report downloaded successfully to CSV format!</span>
        </div>
      )}

      {/* Top metrics summary cards with Brand Aesthetics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-black uppercase tracking-wider">
            <span>Average Order Value</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E72A52]/10 text-[#E72A52]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#111111] font-mono mt-3">
            {formatNaira(43500)}
          </div>
          <div className="text-xs text-[#15803D] font-black mt-2 flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" /> +14.2% vs previous period
          </div>
        </div>

        <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-black uppercase tracking-wider">
            <span>Customer Retention</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#82C7EF]/20 text-[#12597f]">
              <Repeat className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#111111] font-mono mt-3">
            34.8%
          </div>
          <div className="text-xs text-slate-500 mt-2 font-medium">
            Repeat buyers ordering multiple drops
          </div>
        </div>

        <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-black uppercase tracking-wider">
            <span>Store Conversion</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#BCD025]/20 text-[#4c6717]">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#111111] font-mono mt-3">
            4.25%
          </div>
          <div className="text-xs text-[#15803D] font-black mt-2 flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" /> Above industry average (2.8%)
          </div>
        </div>

        <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-black uppercase tracking-wider">
            <span>Physical vs Digital</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7DFA6]/40 text-[#605510]">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#111111] font-mono mt-3">
            68% <span className="text-sm font-semibold text-slate-400">/ 32%</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 font-medium">
            Physical Merch (68%) • Digital (32%)
          </div>
        </div>
      </div>

      {/* Row 2: Top Selling Products Leaderboard & Revenue Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Leaderboard (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl border border-[#CCCCCC]/40 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-[#111111] tracking-tight">
                Best-Selling Products & Asset Rankings
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sorted by cumulative gross sales volume over the selected window.
              </p>
            </div>
            <span className="rounded-full bg-[#E72A52]/10 border border-[#E72A52]/20 px-3 py-1 text-xs font-black text-[#E72A52]">
              Top 5 Leaders
            </span>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <th className="pb-3.5 pl-2">Rank & Product</th>
                  <th className="pb-3.5">Classification</th>
                  <th className="pb-3.5 text-center">Units Sold</th>
                  <th className="pb-3.5 text-right pr-2">Gross Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productPerformance.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#F9FAFB] transition-standard">
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#111111] font-mono text-xs font-black text-white">
                          #{idx + 1}
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-[#111111] truncate block">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{item.category}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4">
                      {item.type === "physical" ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#BCD025]/20 text-[#4c6717] border border-[#BCD025]/40 px-2 py-0.5 text-[10px] font-black uppercase">
                          <Package className="h-3 w-3" /> Physical
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#82C7EF]/20 text-[#12597f] border border-[#82C7EF]/40 px-2 py-0.5 text-[10px] font-black uppercase">
                          <Music className="h-3 w-3" /> Digital
                        </span>
                      )}
                    </td>

                    <td className="py-4 text-center font-mono font-bold text-[#111111]">
                      {item.unitsSold}
                    </td>

                    <td className="py-4 text-right pr-2 font-mono font-black text-[#111111]">
                      {formatNaira(item.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Channel Split Doughnut / Bar (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl border border-[#CCCCCC]/40 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-[#111111] tracking-tight">Sales Channel Split</h3>
            <p className="text-xs text-slate-500 mt-0.5">Physical Goods vs Digital Audio Stems</p>

            <div className="mt-8 flex justify-center">
              {/* Visual Ring Chart */}
              <div className="relative h-48 w-48">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  {/* Background Circle */}
                  <path
                    className="text-slate-100"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Physical Slice 68% (Che Guevara Red #E72A52) */}
                  <path
                    stroke="#E72A52"
                    strokeDasharray="68, 100"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Digital Slice 32% (Light Sky Blue #82C7EF) */}
                  <path
                    stroke="#82C7EF"
                    strokeDasharray="32, 100"
                    strokeDashoffset="-68"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-2xl font-black text-[#111111]">100%</span>
                  <span className="text-[10px] uppercase font-black text-slate-400">Settled Mix</span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#E72A52]/10 border border-[#E72A52]/20">
                <span className="flex items-center gap-2 font-bold text-[#111111]">
                  <span className="h-3 w-3 rounded-full bg-[#E72A52]" /> Physical Merchandise
                </span>
                <span className="font-mono font-black text-[#111111]">68% (₦6.95M)</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#82C7EF]/20 border border-[#82C7EF]/30">
                <span className="flex items-center gap-2 font-bold text-[#111111]">
                  <span className="h-3 w-3 rounded-full bg-[#82C7EF]" /> Digital Audio & Stems
                </span>
                <span className="font-mono font-black text-[#111111]">32% (₦3.33M)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            Digital assets carry 0 courier shipping overhead and instant instant delivery.
          </div>
        </div>
      </div>

      {/* Row 3: Regional Order Distribution */}
      <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-[#111111] tracking-tight">
              Regional Delivery Distribution (Nigeria & West Africa)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Geographic breakdown of fulfilled waybills and courier consignments.
            </p>
          </div>
          <MapPin className="h-6 w-6 text-[#E72A52]" />
        </div>

        <div className="mt-6 space-y-5">
          {regionalDistribution.map((region, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                <span className="font-bold text-[#111111]">{region.region}</span>
                <div className="flex items-center gap-4">
                  <span className="text-slate-500">{region.orders} courier orders</span>
                  <span className="font-mono font-black text-[#111111]">
                    {formatNaira(region.revenue)}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-black w-14 text-center text-white"
                    style={{ backgroundColor: region.color }}
                  >
                    {region.percentage}%
                  </span>
                </div>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${region.percentage}%`, backgroundColor: region.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

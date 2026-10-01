"use client";

import React, { useState } from "react";
import { formatNaira } from "@/lib/utils";
import { BarChart2, TrendingUp, Sparkles, Filter } from "lucide-react";

type MetricType = "sales" | "orders" | "units";
type ChannelType = "all" | "physical" | "digital";

interface ChartDataPoint {
  date: string;
  day: string;
  allSales: number;
  physicalSales: number;
  digitalSales: number;
  allOrders: number;
  physicalOrders: number;
  digitalOrders: number;
  allUnits: number;
  physicalUnits: number;
  digitalUnits: number;
}

const mockChartData: ChartDataPoint[] = [
  { date: "Sep 20", day: "Fri", allSales: 180000, physicalSales: 120000, digitalSales: 60000, allOrders: 5, physicalOrders: 3, digitalOrders: 2, allUnits: 6, physicalUnits: 4, digitalUnits: 2 },
  { date: "Sep 21", day: "Sat", allSales: 295000, physicalSales: 210000, digitalSales: 85000, allOrders: 8, physicalOrders: 5, digitalOrders: 3, allUnits: 10, physicalUnits: 7, digitalUnits: 3 },
  { date: "Sep 22", day: "Sun", allSales: 240000, physicalSales: 140000, digitalSales: 100000, allOrders: 7, physicalOrders: 4, digitalOrders: 3, allUnits: 9, physicalUnits: 5, digitalUnits: 4 },
  { date: "Sep 23", day: "Mon", allSales: 155000, physicalSales: 95000, digitalSales: 60000, allOrders: 4, physicalOrders: 2, digitalOrders: 2, allUnits: 5, physicalUnits: 3, digitalUnits: 2 },
  { date: "Sep 24", day: "Tue", allSales: 310000, physicalSales: 215000, digitalSales: 95000, allOrders: 9, physicalOrders: 6, digitalOrders: 3, allUnits: 12, physicalUnits: 8, digitalUnits: 4 },
  { date: "Sep 25", day: "Wed", allSales: 275000, physicalSales: 185000, digitalSales: 90000, allOrders: 8, physicalOrders: 5, digitalOrders: 3, allUnits: 10, physicalUnits: 6, digitalUnits: 4 },
  { date: "Sep 26", day: "Thu", allSales: 390000, physicalSales: 260000, digitalSales: 130000, allOrders: 11, physicalOrders: 7, digitalOrders: 4, allUnits: 14, physicalUnits: 9, digitalUnits: 5 },
  { date: "Sep 27", day: "Fri", allSales: 420000, physicalSales: 290000, digitalSales: 130000, allOrders: 12, physicalOrders: 8, digitalOrders: 4, allUnits: 16, physicalUnits: 11, digitalUnits: 5 },
  { date: "Sep 28", day: "Sat", allSales: 485000, physicalSales: 340000, digitalSales: 145000, allOrders: 14, physicalOrders: 9, digitalOrders: 5, allUnits: 18, physicalUnits: 12, digitalUnits: 6 },
  { date: "Sep 29", day: "Sun", allSales: 512000, physicalSales: 350000, digitalSales: 162000, allOrders: 15, physicalOrders: 10, digitalOrders: 5, allUnits: 20, physicalUnits: 14, digitalUnits: 6 },
  { date: "Sep 30", day: "Mon", allSales: 285000, physicalSales: 195000, digitalSales: 90000, allOrders: 8, physicalOrders: 5, digitalOrders: 3, allUnits: 10, physicalUnits: 7, digitalUnits: 3 },
];

export default function RevenueChart() {
  const [metric, setMetric] = useState<MetricType>("sales");
  const [channel, setChannel] = useState<ChannelType>("all");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getDataValue = (d: ChartDataPoint) => {
    if (metric === "sales") {
      if (channel === "physical") return d.physicalSales;
      if (channel === "digital") return d.digitalSales;
      return d.allSales;
    }
    if (metric === "orders") {
      if (channel === "physical") return d.physicalOrders;
      if (channel === "digital") return d.digitalOrders;
      return d.allOrders;
    }
    // Units
    if (channel === "physical") return d.physicalUnits;
    if (channel === "digital") return d.digitalUnits;
    return d.allUnits;
  };

  const values = mockChartData.map(getDataValue);
  const maxValue = Math.max(...values, 10);
  const totalValue = values.reduce((sum, v) => sum + v, 0);

  // SVG Chart Dimensions
  const chartHeight = 230;
  const chartWidth = 740;
  const paddingX = 40;
  const paddingY = 30;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  const points = mockChartData.map((d, i) => {
    const x = paddingX + (i / (mockChartData.length - 1)) * innerWidth;
    const val = getDataValue(d);
    const y = paddingY + innerHeight - (val / maxValue) * innerHeight;
    return { x, y, val, d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${
    paddingY + innerHeight
  } L ${points[0].x} ${paddingY + innerHeight} Z`;

  return (
    <div className="rounded-3xl border border-[#CCCCCC]/40 bg-white p-6 sm:p-8 shadow-sm">
      {/* Header with Metric & Channel switchers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-black text-[#111111] tracking-tight">
              Revenue & Performance Trends
            </h3>
            <span className="rounded-full bg-[#E72A52]/10 border border-[#E72A52]/20 px-2.5 py-0.5 text-[11px] font-black text-[#E72A52]">
              Live Stream
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time transaction volume, physical courier deliveries, and digital stem downloads.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Metric Selector */}
          <div className="inline-flex rounded-xl bg-[#F9FAFB] p-1 border border-[#CCCCCC]/40">
            <button
              onClick={() => setMetric("sales")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-standard ${
                metric === "sales"
                  ? "bg-[#E72A52] text-white shadow-xs"
                  : "text-slate-600 hover:text-[#111111]"
              }`}
            >
              Gross Sales
            </button>
            <button
              onClick={() => setMetric("orders")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-standard ${
                metric === "orders"
                  ? "bg-[#E72A52] text-white shadow-xs"
                  : "text-slate-600 hover:text-[#111111]"
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setMetric("units")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-standard ${
                metric === "units"
                  ? "bg-[#E72A52] text-white shadow-xs"
                  : "text-slate-600 hover:text-[#111111]"
              }`}
            >
              Units
            </button>
          </div>

          {/* Product Type Filter */}
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value as ChannelType)}
            className="h-9 rounded-xl border border-[#CCCCCC]/50 bg-[#F9FAFB] px-3 text-xs font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
          >
            <option value="all">All Channels</option>
            <option value="physical">Physical Merch</option>
            <option value="digital">Digital Assets</option>
          </select>
        </div>
      </div>

      {/* Summary figures */}
      <div className="mt-5 flex flex-wrap items-baseline gap-6 sm:gap-10">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Window Volume ({channel.toUpperCase()}):
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#111111] font-mono mt-0.5">
            {metric === "sales" ? formatNaira(totalValue) : `${totalValue.toLocaleString()} ${metric}`}
          </div>
        </div>
        <div className="text-xs text-slate-600 flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-[#E72A52]" />
          <span className="font-semibold">FameMe Brand Escrow Verified Channel</span>
        </div>
      </div>

      {/* Interactive Chart Container */}
      <div className="relative mt-6 w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="chartGradientBrand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E72A52" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#E72A52" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingY + innerHeight * (1 - ratio);
            const valLabel = Math.round(maxValue * ratio);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#F3F4F6"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono font-medium"
                >
                  {metric === "sales" ? `₦${(valLabel / 1000).toFixed(0)}k` : valLabel}
                </text>
              </g>
            );
          })}

          {/* Area fill with Brand Red Gradient */}
          <path d={areaD} fill="url(#chartGradientBrand)" />

          {/* Curve stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="#E72A52"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Invisible hover hotspot */}
                <circle cx={p.x} cy={p.y} r="16" fill="transparent" />

                {/* Visible dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? "6" : "3.5"}
                  fill={isHovered ? "#B12642" : "#FFFFFF"}
                  stroke="#E72A52"
                  strokeWidth={isHovered ? "3.5" : "2.5"}
                  className="transition-all duration-150"
                />

                {/* X Axis labels */}
                <text
                  x={p.x}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  className={`text-[10px] font-mono ${
                    isHovered ? "fill-[#E72A52] font-black" : "fill-slate-400 font-semibold"
                  }`}
                >
                  {p.d.date.split(" ")[1]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Box */}
        {hoveredIndex !== null && (
          <div
            className="pointer-events-none absolute z-20 rounded-xl bg-[#111111] p-3 text-white shadow-xl text-xs border border-[#CCCCCC]/30 animate-in fade-in zoom-in-95"
            style={{
              left: `${(hoveredIndex / (mockChartData.length - 1)) * 88 + 4}%`,
              top: "15px",
            }}
          >
            <div className="font-bold text-[#E7DFA6] text-[11px]">
              {mockChartData[hoveredIndex].date} ({mockChartData[hoveredIndex].day})
            </div>
            <div className="mt-1 font-mono font-black text-sm text-white">
              {metric === "sales"
                ? formatNaira(getDataValue(mockChartData[hoveredIndex]))
                : `${getDataValue(mockChartData[hoveredIndex])} ${metric}`}
            </div>
            <div className="mt-1 pt-1 border-t border-slate-700 text-[10px] text-slate-300 flex justify-between gap-3">
              <span>Physical: {mockChartData[hoveredIndex].physicalOrders}</span>
              <span>Digital: {mockChartData[hoveredIndex].digitalOrders}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

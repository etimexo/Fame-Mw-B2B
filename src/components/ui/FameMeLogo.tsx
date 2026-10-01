"use client";

import React from "react";

interface FameMeLogoProps {
  variant?: "full" | "emblem" | "horizontal" | "badge";
  className?: string;
  showSlogan?: boolean;
}

export default function FameMeLogo({
  variant = "horizontal",
  className = "",
  showSlogan = true,
}: FameMeLogoProps) {
  // 1. Emblem only: The iconic 'ME' geometric blocks
  // Serpent Sceptre (#BCD025) for M bars, Che Guevara Red (#E72A52), Beige (#E7DFA6), Light Sky Blue (#82C7EF) for E bars
  if (variant === "emblem") {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 100 80"
          className="w-full h-full select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 'M' - Serpent Sceptre Green Verticals */}
          <rect x="2" y="4" width="13" height="72" rx="1.5" fill="#BCD025" />
          <rect x="20" y="4" width="13" height="43" rx="1.5" fill="#BCD025" />
          <rect x="38" y="4" width="13" height="72" rx="1.5" fill="#BCD025" />

          {/* 'E' - Colored Horizontal Bars */}
          <rect x="58" y="4" width="38" height="17" rx="1.5" fill="#E72A52" />
          <rect x="58" y="31" width="28" height="17" rx="1.5" fill="#E7DFA6" />
          <rect x="58" y="59" width="38" height="17" rx="1.5" fill="#82C7EF" />
        </svg>
      </div>
    );
  }

  // 2. Full official badge with Dreamless Sleep (#111111) background and slogan
  if (variant === "full") {
    return (
      <div
        className={`relative inline-block overflow-hidden rounded-xl bg-[#111111] p-3.5 shadow-md border border-[#CCCCCC]/20 ${className}`}
      >
        <svg
          viewBox="0 0 1000 667"
          className="w-full h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <rect width="1000" height="667" fill="#111111" rx="16" />

          {/* 'M' - Serpent Sceptre Green */}
          <rect x="25" y="45" width="130" height="705" fill="#BCD025" transform="scale(0.85) translate(40, 20)" />
          <rect x="205" y="45" width="130" height="425" fill="#BCD025" transform="scale(0.85) translate(40, 20)" />
          <rect x="385" y="45" width="130" height="705" fill="#BCD025" transform="scale(0.85) translate(40, 20)" />

          {/* 'E' - Red, Beige, Blue Bars */}
          <rect x="585" y="45" width="350" height="165" fill="#E72A52" transform="scale(0.85) translate(40, 20)" />
          <rect x="585" y="310" width="255" height="165" fill="#E7DFA6" transform="scale(0.85) translate(40, 20)" />
          <rect x="585" y="585" width="350" height="165" fill="#82C7EF" transform="scale(0.85) translate(40, 20)" />

          {/* Slogan */}
          <text
            x="60"
            y="555"
            fill="#FFFFFF"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="52"
            fontWeight="700"
            letterSpacing="1"
          >
            IS WHAT MAKES ME DIFFERENT
          </text>

          {/* Registered Trademark symbol */}
          <g transform="translate(925, 600)">
            <circle cx="0" cy="0" r="28" fill="none" stroke="#FFFFFF" strokeWidth="4.5" />
            <text
              x="0"
              y="11"
              fill="#FFFFFF"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="34"
              fontWeight="700"
              textAnchor="middle"
            >
              R
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 3. Compact rounded badge (ideal for headers and cards)
  if (variant === "badge") {
    return (
      <div
        className={`flex items-center gap-2 rounded-xl bg-[#111111] px-3 py-1.5 shadow-sm border border-[#CCCCCC]/25 ${className}`}
      >
        <div className="h-6 w-7 shrink-0">
          <svg viewBox="0 0 100 80" className="w-full h-full" fill="none">
            <rect x="2" y="4" width="13" height="72" rx="1" fill="#BCD025" />
            <rect x="20" y="4" width="13" height="43" rx="1" fill="#BCD025" />
            <rect x="38" y="4" width="13" height="72" rx="1" fill="#BCD025" />
            <rect x="58" y="4" width="38" height="17" rx="1" fill="#E72A52" />
            <rect x="58" y="31" width="28" height="17" rx="1" fill="#E7DFA6" />
            <rect x="58" y="59" width="38" height="17" rx="1" fill="#82C7EF" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-black tracking-tight text-white leading-none">
            FAME ME
          </span>
          <span className="text-[8px] font-bold text-[#E7DFA6] tracking-wider leading-none mt-0.5">
            IS WHAT MAKES ME DIFFERENT
          </span>
        </div>
      </div>
    );
  }

  // 4. Default: Horizontal Brand Lockup with geometric icon + clean typography
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Dark iconic emblem container */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#111111] p-1.5 shadow-sm ring-1 ring-black/10">
        <svg viewBox="0 0 100 80" className="w-full h-full" fill="none">
          <rect x="2" y="4" width="13" height="72" rx="1.5" fill="#BCD025" />
          <rect x="20" y="4" width="13" height="43" rx="1.5" fill="#BCD025" />
          <rect x="38" y="4" width="13" height="72" rx="1.5" fill="#BCD025" />
          <rect x="58" y="4" width="38" height="17" rx="1.5" fill="#E72A52" />
          <rect x="58" y="31" width="28" height="17" rx="1.5" fill="#E7DFA6" />
          <rect x="58" y="59" width="38" height="17" rx="1.5" fill="#82C7EF" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-base font-black tracking-tight text-[#111111] leading-none">
            Fame <span className="text-[#E72A52]">&</span> Me
          </span>
          <span className="rounded-md bg-[#82C7EF]/20 text-[#0e5c8a] border border-[#82C7EF]/40 px-1.5 py-0.5 text-[9px] font-black tracking-wide">
            B2B HUB
          </span>
        </div>
        {showSlogan && (
          <span className="text-[9px] font-bold tracking-wider text-slate-500 uppercase leading-tight mt-0.5">
            Is What Makes Me Different®
          </span>
        )}
      </div>
    </div>
  );
}

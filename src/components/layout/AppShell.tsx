"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { DashboardProvider } from "@/context/DashboardContext";
import DashboardShell from "./DashboardShell";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

// Routes that should NOT show the dashboard shell
const PUBLIC_ROUTES = ["/login", "/auth"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoading } = useAuth();

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Show full-screen loader while session is being checked
  if (isLoading && !isPublicRoute) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#E72A52] to-[#B12642] flex items-center justify-center shadow-lg">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          </div>
          <p className="text-sm text-slate-400 font-semibold">
            Loading Partner Hub…
          </p>
        </div>
      </div>
    );
  }

  // Public routes (login, auth callback) — render as-is
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Protected routes — wrap with DashboardProvider + DashboardShell
  return (
    <DashboardProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
}

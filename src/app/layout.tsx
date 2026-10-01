import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DashboardProvider } from "@/context/DashboardContext";
import DashboardShell from "@/components/layout/DashboardShell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Fame & Me (FameMe) B2B Partner Hub | Merchant & Seller Dashboard",
  description:
    "Official B2B Partner & Vendor Dashboard for the Fame & Me marketplace ecosystem. Manage merchandise, audio stems, courier waybills, escrow payouts, and multi-user company operations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#E72A52] selection:text-white">
        <DashboardProvider>
          <DashboardShell>{children}</DashboardShell>
        </DashboardProvider>
      </body>
    </html>
  );
}

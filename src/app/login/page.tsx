"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import FameMeLogo from "@/components/ui/FameMeLogo";
import {
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Building2,
  Store,
} from "lucide-react";

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isPending, startTransition] = useTransition();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [partnerType, setPartnerType] = useState<"seller" | "company">("seller");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error);
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        if (!businessName.trim()) {
          setError("Please provide your business or brand name.");
          return;
        }
        const { error } = await signUp(
          email,
          password,
          businessName,
          partnerType
        );
        if (error) {
          setError(error);
        } else {
          router.push("/");
          router.refresh();
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E72A52]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#82C7EF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#BCD025]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl">
          {/* Logo + Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <FameMeLogo variant="badge" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {mode === "login" ? "Partner Hub Sign In" : "Register Partner Account"}
            </h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              {mode === "login"
                ? "Access your B2B seller dashboard and manage catalog, orders, and payouts."
                : "Create a verified seller account to start managing your brand on FameMe."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-white/5 border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
                setSuccessMessage(null);
              }}
              className={`py-2 text-xs font-black rounded-lg transition-all duration-200 ${
                mode === "login"
                  ? "bg-[#E72A52] text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
                setSuccessMessage(null);
              }}
              className={`py-2 text-xs font-black rounded-lg transition-all duration-200 ${
                mode === "signup"
                  ? "bg-[#E72A52] text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#BCD025]">
              <ShieldCheck className="h-3.5 w-3.5" />
              End-to-End Encrypted
            </span>
            <span className="w-px h-3 bg-white/20" />
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#82C7EF]">
              <Sparkles className="h-3.5 w-3.5" />
              B2B Partner Portal
            </span>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3.5 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-[#E72A52]/10 border border-[#E72A52]/30 p-3.5 text-sm text-[#E72A52]">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                {/* Business Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="business-name"
                    className="text-xs font-bold text-slate-300 uppercase tracking-wide"
                  >
                    Business / Brand Name
                  </label>
                  <input
                    id="business-name"
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    placeholder="e.g. Apex Apparel Ltd"
                    className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/50 focus:border-[#E72A52]/60 transition-all duration-200"
                  />
                </div>

                {/* Account Type Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Account Classification
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPartnerType("seller")}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                        partnerType === "seller"
                          ? "border-[#E72A52] bg-[#E72A52]/15 text-white"
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      <Store className="h-4 w-4 text-[#E72A52]" />
                      <span>Individual Seller</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPartnerType("company")}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                        partnerType === "company"
                          ? "border-[#82C7EF] bg-[#82C7EF]/15 text-white"
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      <Building2 className="h-4 w-4 text-[#82C7EF]" />
                      <span>Registered Company</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="text-xs font-bold text-slate-300 uppercase tracking-wide"
              >
                Work Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="your@business.com"
                className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/50 focus:border-[#E72A52]/60 transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="text-xs font-bold text-slate-300 uppercase tracking-wide"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder={mode === "login" ? "Your secure password" : "At least 6 characters"}
                  minLength={6}
                  className="w-full h-12 px-4 pr-12 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/50 focus:border-[#E72A52]/60 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isPending || !email || !password || (mode === "signup" && !businessName)}
              className="w-full h-12 mt-2 flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#E72A52] to-[#B12642] text-sm font-black text-white shadow-lg hover:opacity-95 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {mode === "login" ? "Signing in..." : "Creating Account..."}
                </>
              ) : mode === "login" ? (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In to Dashboard
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Register as Partner
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 text-center">
            {mode === "login" ? (
              <p className="text-xs text-slate-500 leading-relaxed">
                Need an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                  }}
                  className="text-[#82C7EF] hover:underline font-semibold"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500 leading-relaxed">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="text-[#82C7EF] hover:underline font-semibold"
                >
                  Sign in instead
                </button>
              </p>
            )}
            <p className="text-xs text-slate-600 mt-2">
              Need assistance? Contact{" "}
              <a
                href="mailto:support@fameme.ng"
                className="text-[#82C7EF] hover:text-white transition-colors"
              >
                support@fameme.ng
              </a>
            </p>
          </div>
        </div>

        {/* Below card label */}
        <p className="text-center text-[11px] text-slate-600 mt-5">
          © {new Date().getFullYear()} FameMe Marketplace · B2B Partner Hub v1.0
        </p>
      </div>
    </div>
  );
}

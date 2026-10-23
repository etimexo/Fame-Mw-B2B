"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { PartnerProfile } from "@/types";

export interface AuthUser {
  id: string;
  email: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDbProfile(row: any): PartnerProfile {
  if (!row) {
    return {
      id: "",
      type: "seller",
      businessName: "",
      tagline: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "Nigeria",
      logo: "",
      banner: "",
      bio: "",
      commissionRate: 0.1,
      kycStatus: "pending",
      agreementSigned: false,
      tierName: "Bronze Seller",
      verifiedBadge: "",
    };
  }
  return {
    id: row.id,
    type: row.type || "seller",
    businessName: row.business_name || "Merchant",
    tagline: row.tagline ?? "",
    email: row.email || "",
    phone: row.phone ?? "",
    address: row.address ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    country: row.country ?? "Nigeria",
    cacNumber: row.cac_number,
    tinNumber: row.tin_number,
    ninNumber: row.nin_number,
    logo: row.logo ?? "",
    banner: row.banner ?? "",
    bio: row.bio ?? "",
    commissionRate: Number(row.commission_rate ?? 0.1),
    kycStatus: row.kyc_status ?? "pending",
    agreementSigned: Boolean(row.agreement_signed),
    tierName: row.tier_name ?? "Bronze Seller",
    verifiedBadge: row.verified_badge,
  };
}

interface AuthContextType {
  user: AuthUser | null;
  profile: PartnerProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    businessName: string,
    partnerType?: "company" | "seller"
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<PartnerProfile>) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          if (data.profile) setProfile(mapDbProfile(data.profile));
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    } catch {
      // offline or unconfigured
    }
  }, []);

  useEffect(() => {
    refreshProfile().finally(() => setIsLoading(false));
  }, [refreshProfile]);

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || "Failed to sign in" };
      }
      setUser(data.user);
      if (data.profile) setProfile(mapDbProfile(data.profile));
      return { error: null };
    } catch {
      return { error: "Network error while connecting to server." };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    businessName: string,
    partnerType: "company" | "seller" = "seller"
  ): Promise<{ error: string | null }> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, businessName, partnerType }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || "Failed to create account" };
      }
      setUser(data.user);
      if (data.profile) setProfile(mapDbProfile(data.profile));
      return { error: null };
    } catch {
      return { error: "Network error while connecting to server." };
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      setProfile(null);
      window.location.href = "/login";
    }
  };

  const updateProfile = async (
    updates: Partial<PartnerProfile>
  ): Promise<{ error: string | null }> => {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || "Failed to update profile" };
      }
      if (data.profile) setProfile(mapDbProfile(data.profile));
      return { error: null };
    } catch {
      return { error: "Failed to update profile" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

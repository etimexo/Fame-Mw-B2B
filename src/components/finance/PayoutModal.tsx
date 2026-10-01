"use client";

import React, { useState } from "react";
import {
  X,
  Wallet,
  Building2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { formatNaira } from "@/lib/utils";
import { nigerianBanks } from "@/lib/seed-data";

interface PayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PayoutModal({ isOpen, onClose }: PayoutModalProps) {
  const { balances, requestPayout, profile } = useDashboard();

  const [bankId, setBankId] = useState("gtb");
  const [accountNumber, setAccountNumber] = useState("0192849142");
  const [accountName, setAccountName] = useState(
    profile.type === "company" ? "AfroGroove Media Ltd" : "Tunde Ayomide"
  );
  const [amount, setAmount] = useState<number>(Math.min(250000, balances.availableWithdrawable));
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const selectedBank = nigerianBanks.find((b) => b.id === bankId) || nigerianBanks[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (amount <= 0) {
      setErrorMessage("Please enter an amount greater than ₦0");
      return;
    }

    if (amount > balances.availableWithdrawable) {
      setErrorMessage(
        `Requested amount exceeds available withdrawable balance of ${formatNaira(
          balances.availableWithdrawable
        )}`
      );
      return;
    }

    const success = requestPayout(
      amount,
      selectedBank.name,
      accountNumber,
      accountName
    );

    if (success) {
      setIsSuccess(true);
    } else {
      setErrorMessage("Payout request could not be processed. Check balance limits.");
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Request Payout / Withdrawal
              </h3>
              <p className="text-[11px] text-slate-500">
                Direct NIBSS Instant Settlement to verified Nigerian bank account
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Payout Batch Initiated!</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                <strong>{formatNaira(amount)}</strong> has been queued for transfer to{" "}
                <strong>{selectedBank.name}</strong> ({accountNumber} - {accountName}).
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
              Settlement Batch ID: <span className="font-mono font-bold text-[#B12642]">SETTLE-NGN-{Date.now().toString().slice(-6)}</span>
              <br />
              Funds typically reflect within 15–30 minutes via NIBSS.
            </div>
            <button
              onClick={handleClose}
              className="w-full rounded-xl bg-[#E72A52] hover:bg-[#B12642] py-2.5 text-xs font-bold text-white shadow-xs"
            >
              Done & Return to Finance
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Available balance highlight */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800">
                  Available Withdrawable Balance
                </span>
                <div className="text-xl font-black font-mono text-emerald-950 mt-0.5">
                  {formatNaira(balances.availableWithdrawable)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAmount(balances.availableWithdrawable)}
                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-2xs"
              >
                Withdraw Max
              </button>
            </div>

            {/* Amount input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Withdrawal Amount (NGN ₦) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-400">
                  ₦
                </span>
                <input
                  type="number"
                  required
                  min={1000}
                  max={balances.availableWithdrawable}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-10 pl-8 pr-3 rounded-lg border border-slate-200 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Standard NIBSS processing fee: ₦100.00
              </span>
            </div>

            {/* Destination Bank */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Settlement Nigerian Bank *
              </label>
              <select
                value={bankId}
                onChange={(e) => setBankId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {nigerianBanks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} (Code: {b.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  NUBAN Account Number *
                </label>
                <input
                  type="text"
                  maxLength={10}
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Verified Account Name *
                </label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1 text-slate-700 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Bank Account KYC Verified
              </div>
              <p>Payouts are strictly credited to the business/creator name registered during KYC.</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                Confirm Payout Transfer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  Star,
  ShieldCheck,
  MessageSquare,
  AlertTriangle,
  Flag,
  CheckCircle2,
  X,
  Send,
  ThumbsUp,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { Review } from "@/types";
import { formatDate } from "@/lib/utils";

export default function ReviewsView() {
  const { reviews, replyReview, reportReview } = useDashboard();

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [reportingReview, setReportingReview] = useState<Review | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const handleSendReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    replyReview(reviewId, replyText.trim());
    setActiveReplyId(null);
    setReplyText("");
    setToastMessage("Merchant reply published publicly on FameMe product page!");
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingReview) return;
    reportReview(reportingReview.id);
    setReportingReview(null);
    setReportReason("");
    setToastMessage("Review reported to Fame & Me moderation for policy review.");
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Average rating
  const totalStars = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = (totalStars / reviews.length).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Customer Feedback, Ratings & Merchant Replies
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Engage with buyers, reply to verified product feedback, and maintain your store score.
          </p>
        </div>

        {/* Rating score badge */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-3xl border border-[#CCCCCC]/40 shadow-2xs">
          <div className="flex items-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(Number(avgRating)) ? "fill-amber-400 text-amber-400" : "text-slate-300"
                }`}
              />
            ))}
          </div>
          <div>
            <span className="font-mono text-base font-extrabold text-slate-900">
              {avgRating} / 5.0
            </span>
            <span className="text-[11px] text-slate-500 block">
              {reviews.length} Verified Reviews
            </span>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className={`rounded-2xl border bg-white p-6 sm:p-8 shadow-sm space-y-3 transition-standard ${
              r.reported ? "border-amber-200 bg-amber-50/20 opacity-80" : "border-slate-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900 text-xs">{r.title}</span>
                  {r.reported && (
                    <span className="rounded bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2">
                      Report Under Review
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Product: <strong className="text-slate-700">{r.productTitle}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-400 text-[11px]">{formatDate(r.createdAt)}</span>
                <button
                  onClick={() => setReportingReview(r)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-600 transition-standard"
                  title="Report Abuse"
                >
                  <Flag className="h-3 w-3" /> Report
                </button>
              </div>
            </div>

            {/* Comment Body */}
            <p className="text-xs text-slate-700 leading-relaxed">{r.comment}</p>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="font-bold text-slate-900">{r.customerName}</span>
              {r.verifiedPurchase && (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified Purchase
                </span>
              )}
            </div>

            {/* Existing Reply */}
            {r.reply ? (
              <div className="mt-3 rounded-xl border border-[#CCCCCC]/40 bg-[#E72A52]/10/60 p-3 text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#111111] flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 text-[#E72A52]" />
                    Response from {r.reply.merchantName} (Merchant)
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    {formatDate(r.reply.repliedAt)}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">{r.reply.message}</p>
              </div>
            ) : (
              <div className="pt-2">
                {activeReplyId === r.id ? (
                  <div className="space-y-2 mt-2">
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a professional, courteous public response to this customer..."
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E72A52]/20"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setActiveReplyId(null);
                          setReplyText("");
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSendReply(r.id)}
                        className="flex items-center gap-1 rounded-lg bg-[#E72A52] hover:bg-[#B12642] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
                      >
                        <Send className="h-3.5 w-3.5" /> Post Public Reply
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveReplyId(r.id);
                      setReplyText("");
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-standard"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-[#E72A52]" /> Reply to Review
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Report Review Modal */}
      {reportingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-[#CCCCCC]/40 bg-white shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-sm font-bold text-slate-900">
                Report Inappropriate or Fraudulent Review
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Review from <strong>{reportingReview.customerName}</strong> on &quot;{reportingReview.productTitle}&quot;.
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Violation Category *
                </label>
                <select className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800">
                  <option>Courier Mishandling (Not Product Quality)</option>
                  <option>Profanity, Hate Speech or Harassment</option>
                  <option>Competitor Extortion / False Review</option>
                  <option>Spam or Irrelevant Marketing Content</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Details & Explanation
                </label>
                <textarea
                  required
                  rows={3}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Explain why this review violates FameMe seller protection policies..."
                  className="w-full p-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReportingReview(null)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-bold text-white shadow-xs"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

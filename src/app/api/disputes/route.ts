import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sql = getSql();
    if (!sql) return NextResponse.json({ error: "Database not connected" }, { status: 503 });

    const body = await request.json();
    const { disputeId, action, reason, message, senderName } = body;

    if (!disputeId) {
      return NextResponse.json({ error: "Dispute ID is required" }, { status: 400 });
    }

    // Load existing dispute
    const existingRows = await sql`
      SELECT id, status, messages FROM disputes WHERE id = ${disputeId} AND partner_id = ${userId} LIMIT 1
    `;
    if (existingRows.length === 0) {
      return NextResponse.json({ error: "Dispute not found" }, { status: 404 });
    }

    const dispute = existingRows[0];
    const messages = Array.isArray(dispute.messages) ? dispute.messages : [];
    const now = new Date().toISOString();

    if (action) {
      // Merchant action: accepted, rejected, refunded
      const newStatus = action === "refunded" ? "resolved" : "under_review";
      const actionText = action === "accepted" ? "Claim Accepted" : action === "refunded" ? "Refund Processed" : "Claim Disputed";
      const newMsg = {
        id: `msg-${Date.now()}`,
        sender: "merchant",
        senderName: senderName || "Merchant",
        message: `${actionText}: ${reason}`,
        timestamp: now,
      };

      const updatedMessages = [...messages, newMsg];
      const merchantResponse = { action, reason, respondedAt: now };

      const rows = await sql`
        UPDATE disputes
        SET
          status = ${newStatus},
          merchant_response = ${JSON.stringify(merchantResponse)}::jsonb,
          messages = ${JSON.stringify(updatedMessages)}::jsonb,
          updated_at = NOW()
        WHERE id = ${disputeId} AND partner_id = ${userId}
        RETURNING *
      `;
      return NextResponse.json({ success: true, dispute: rows[0] });
    }

    if (message) {
      // Merchant message to customer/admin
      const newMsg = {
        id: `msg-${Date.now()}`,
        sender: "merchant",
        senderName: senderName || "Merchant",
        message,
        timestamp: now,
      };
      const updatedMessages = [...messages, newMsg];

      const rows = await sql`
        UPDATE disputes
        SET
          messages = ${JSON.stringify(updatedMessages)}::jsonb,
          updated_at = NOW()
        WHERE id = ${disputeId} AND partner_id = ${userId}
        RETURNING *
      `;
      return NextResponse.json({ success: true, dispute: rows[0] });
    }

    return NextResponse.json({ error: "No action or message provided" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update dispute";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

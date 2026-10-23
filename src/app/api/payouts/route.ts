import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sql = getSql();
    if (!sql) return NextResponse.json({ error: "Database not connected" }, { status: 503 });

    const { amount, bankName, accountNumber, accountName } = await request.json();

    if (!amount || amount <= 0 || !bankName || !accountNumber || !accountName) {
      return NextResponse.json({ error: "Invalid payout details" }, { status: 400 });
    }

    const fee = 100; // Flat ₦100 settlement processing fee
    const netAmount = amount - fee;
    const batchId = `PAY-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`;
    const reference = `REF-NG-${Date.now()}`;

    const rows = await sql`
      INSERT INTO payouts (
        partner_id, batch_id, amount, status, bank_name, account_number, account_name, reference, fee, net_amount
      )
      VALUES (
        ${userId}, ${batchId}, ${amount}, 'processing', ${bankName}, ${accountNumber}, ${accountName}, ${reference}, ${fee}, ${netAmount}
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, payout: rows[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to request payout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

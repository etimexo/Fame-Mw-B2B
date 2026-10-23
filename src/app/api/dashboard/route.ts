import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sql = getSql();
    if (!sql) {
      return NextResponse.json({
        profile: null,
        products: [],
        orders: [],
        disputes: [],
        payouts: [],
        reviews: [],
        staff: [],
        branches: [],
        inventoryLogs: [],
        notifications: [],
        supportTickets: [],
      });
    }

    const [
      profileRows,
      productsRows,
      ordersRows,
      disputesRows,
      payoutsRows,
      reviewsRows,
      staffRows,
      branchesRows,
      inventoryLogsRows,
      notificationsRows,
      supportTicketsRows,
    ] = await Promise.all([
      sql`SELECT * FROM partner_profiles WHERE id = ${userId} LIMIT 1`,
      sql`SELECT * FROM products WHERE partner_id = ${userId} ORDER BY created_at DESC`,
      sql`SELECT * FROM orders WHERE partner_id = ${userId} ORDER BY created_at DESC`,
      sql`SELECT * FROM disputes WHERE partner_id = ${userId} ORDER BY created_at DESC`,
      sql`SELECT * FROM payouts WHERE partner_id = ${userId} ORDER BY created_at DESC`,
      sql`SELECT * FROM reviews WHERE partner_id = ${userId} ORDER BY created_at DESC`,
      sql`SELECT * FROM staff WHERE partner_id = ${userId} ORDER BY created_at DESC`,
      sql`SELECT * FROM branches WHERE partner_id = ${userId} ORDER BY created_at DESC`,
      sql`SELECT * FROM inventory_logs WHERE partner_id = ${userId} ORDER BY created_at DESC`,
      sql`SELECT * FROM notifications WHERE partner_id = ${userId} ORDER BY created_at DESC`,
      sql`SELECT * FROM support_tickets WHERE partner_id = ${userId} ORDER BY created_at DESC`,
    ]);

    return NextResponse.json({
      profile: profileRows.length > 0 ? profileRows[0] : null,
      products: productsRows,
      orders: ordersRows,
      disputes: disputesRows,
      payouts: payoutsRows,
      reviews: reviewsRows,
      staff: staffRows,
      branches: branchesRows,
      inventoryLogs: inventoryLogsRows,
      notifications: notificationsRows,
      supportTickets: supportTicketsRows,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load dashboard data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sql = getSql();
    if (!sql) return NextResponse.json({ error: "Database not connected" }, { status: 503 });

    const body = await request.json();
    const { orderId, action, status, courier, trackingNumber, dispatchBranch } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    if (action === "dispatch") {
      const rows = await sql`
        UPDATE orders
        SET
          status = 'shipped',
          courier = ${courier},
          tracking_number = ${trackingNumber},
          dispatch_branch = ${dispatchBranch},
          dispatched_at = NOW(),
          updated_at = NOW()
        WHERE id = ${orderId} AND partner_id = ${userId}
        RETURNING *
      `;
      return NextResponse.json({ success: true, order: rows[0] });
    }

    if (status) {
      const isDelivered = status === "delivered";
      const rows = await sql`
        UPDATE orders
        SET
          status = ${status},
          delivered_at = CASE WHEN ${isDelivered} THEN NOW() ELSE delivered_at END,
          updated_at = NOW()
        WHERE id = ${orderId} AND partner_id = ${userId}
        RETURNING *
      `;
      return NextResponse.json({ success: true, order: rows[0] });
    }

    return NextResponse.json({ error: "No valid action specified" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

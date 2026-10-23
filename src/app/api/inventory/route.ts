import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sql = getSql();
    if (!sql) return NextResponse.json({ error: "Database not connected" }, { status: 503 });

    const { productId, newStock, reason, changedBy } = await request.json();

    if (!productId || newStock === undefined) {
      return NextResponse.json({ error: "Product ID and new stock required" }, { status: 400 });
    }

    // Get current stock
    const prodRows = await sql`
      SELECT id, title, stock FROM products WHERE id = ${productId} AND partner_id = ${userId} LIMIT 1
    `;
    if (prodRows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const prevStock = prodRows[0].stock;
    const change = newStock - prevStock;

    // Update product stock
    await sql`
      UPDATE products SET stock = ${newStock}, updated_at = NOW() WHERE id = ${productId} AND partner_id = ${userId}
    `;

    // Insert log
    const logRows = await sql`
      INSERT INTO inventory_logs (
        partner_id, product_id, product_title, previous_stock, new_stock, change, reason, changed_by
      )
      VALUES (
        ${userId}, ${productId}, ${prodRows[0].title}, ${prevStock}, ${newStock}, ${change},
        ${reason || "Manual stock adjustment"}, ${changedBy || "Merchant"}
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, log: logRows[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update inventory";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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
    const {
      title,
      description,
      category,
      subcategory,
      type,
      sku,
      barcode,
      price,
      salePrice,
      stock,
      lowStockThreshold,
      approvalStatus,
      status,
      imageUrl,
      tags,
      weightKg,
      dimensionsCm,
      branchLocationId,
      digitalFileFormat,
      digitalFileSize,
      digitalDownloadLimit,
      digitalSampleUrl,
      licenseType,
    } = body;

    const rows = await sql`
      INSERT INTO products (
        partner_id, title, description, category, subcategory, type, sku, barcode,
        price, sale_price, stock, low_stock_threshold, approval_status, status,
        image_url, tags, weight_kg, dimensions_cm, branch_location_id,
        digital_file_format, digital_file_size, digital_download_limit,
        digital_sample_url, license_type
      )
      VALUES (
        ${userId}, ${title}, ${description || null}, ${category || null},
        ${subcategory || null}, ${type || "physical"}, ${sku || null}, ${barcode || null},
        ${price || 0}, ${salePrice || null}, ${stock || 0}, ${lowStockThreshold || 5},
        ${approvalStatus || "under_review"}, ${status || "draft"},
        ${imageUrl || null}, ${tags || []}, ${weightKg || null},
        ${dimensionsCm ? JSON.stringify(dimensionsCm) : null},
        ${branchLocationId || null}, ${digitalFileFormat || null},
        ${digitalFileSize || null}, ${digitalDownloadLimit || null},
        ${digitalSampleUrl || null}, ${licenseType || null}
      )
      RETURNING *
    `;

    const product = rows[0];

    // Log initial inventory if physical stock > 0
    if (type === "physical" && Number(stock) > 0) {
      await sql`
        INSERT INTO inventory_logs (
          partner_id, product_id, product_title, previous_stock, new_stock, change, reason, changed_by
        )
        VALUES (
          ${userId}, ${product.id}, ${title}, 0, ${stock}, ${stock},
          'Initial product catalog entry', 'Merchant'
        )
      `;
    }

    return NextResponse.json({ success: true, product });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sql = getSql();
    if (!sql) return NextResponse.json({ error: "Database not connected" }, { status: 503 });

    const { id, updates } = await request.json();
    if (!id || !updates) {
      return NextResponse.json({ error: "Product id and updates required" }, { status: 400 });
    }

    // Build update parameters securely
    const rows = await sql`
      UPDATE products
      SET
        title = COALESCE(${updates.title}, title),
        description = COALESCE(${updates.description}, description),
        category = COALESCE(${updates.category}, category),
        subcategory = COALESCE(${updates.subcategory}, subcategory),
        price = COALESCE(${updates.price}, price),
        sale_price = COALESCE(${updates.salePrice}, sale_price),
        stock = COALESCE(${updates.stock}, stock),
        low_stock_threshold = COALESCE(${updates.lowStockThreshold}, low_stock_threshold),
        status = COALESCE(${updates.status}, status),
        approval_status = COALESCE(${updates.approvalStatus}, approval_status),
        image_url = COALESCE(${updates.imageUrl}, image_url),
        updated_at = NOW()
      WHERE id = ${id} AND partner_id = ${userId}
      RETURNING *
    `;

    return NextResponse.json({ success: true, product: rows[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sql = getSql();
    if (!sql) return NextResponse.json({ error: "Database not connected" }, { status: 503 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Product id required" }, { status: 400 });

    await sql`DELETE FROM products WHERE id = ${id} AND partner_id = ${userId}`;
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sql = getSql();
    if (!sql) return NextResponse.json({ error: "Database not connected" }, { status: 503 });

    const updates = await request.json();

    const rows = await sql`
      UPDATE partner_profiles
      SET
        business_name = COALESCE(${updates.businessName}, business_name),
        tagline = COALESCE(${updates.tagline}, tagline),
        phone = COALESCE(${updates.phone}, phone),
        address = COALESCE(${updates.address}, address),
        city = COALESCE(${updates.city}, city),
        state = COALESCE(${updates.state}, state),
        country = COALESCE(${updates.country}, country),
        cac_number = COALESCE(${updates.cacNumber}, cac_number),
        tin_number = COALESCE(${updates.tinNumber}, tin_number),
        nin_number = COALESCE(${updates.ninNumber}, nin_number),
        logo = COALESCE(${updates.logo}, logo),
        banner = COALESCE(${updates.banner}, banner),
        bio = COALESCE(${updates.bio}, bio),
        updated_at = NOW()
      WHERE id = ${userId}
      RETURNING *
    `;

    return NextResponse.json({ success: true, profile: rows[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

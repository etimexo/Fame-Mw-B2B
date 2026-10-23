import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ user: null, profile: null });
    }

    const sql = getSql();
    if (!sql) {
      return NextResponse.json({ user: null, profile: null });
    }

    const userRows = await sql`
      SELECT id, email FROM users WHERE id = ${userId} LIMIT 1
    `;
    if (userRows.length === 0) {
      return NextResponse.json({ user: null, profile: null });
    }

    const profileRows = await sql`
      SELECT * FROM partner_profiles WHERE id = ${userId} LIMIT 1
    `;

    return NextResponse.json({
      user: userRows[0],
      profile: profileRows.length > 0 ? profileRows[0] : null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

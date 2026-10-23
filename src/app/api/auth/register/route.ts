import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, businessName, partnerType } = await request.json();

    if (!email || !password || !businessName) {
      return NextResponse.json(
        { error: "Email, password, and business name are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const sql = getSql();
    if (!sql) {
      return NextResponse.json(
        {
          error:
            "Neon Database is not connected. Please paste your DATABASE_URL in .env.local and run neon-schema.sql in your Neon Console.",
        },
        { status: 503 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const type = partnerType === "company" ? "company" : "seller";

    // Check if user already exists
    const existing = await sql`
      SELECT id FROM users WHERE lower(email) = ${cleanEmail} LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in." },
        { status: 409 }
      );
    }

    const { hash, salt } = hashPassword(password);

    // Insert user
    const userRows = await sql`
      INSERT INTO users (email, password_hash, salt)
      VALUES (${cleanEmail}, ${hash}, ${salt})
      RETURNING id, email, created_at
    `;
    const user = userRows[0];

    // Insert profile
    const profileRows = await sql`
      INSERT INTO partner_profiles (
        id, email, type, business_name, commission_rate, kyc_status, agreement_signed
      )
      VALUES (
        ${user.id}, ${cleanEmail}, ${type}, ${businessName.trim()}, 0.10, 'pending', false
      )
      RETURNING *
    `;
    const profile = profileRows[0];

    // Set authenticated session cookie
    await setSessionCookie(user.id);

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email },
      profile,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to register partner account";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

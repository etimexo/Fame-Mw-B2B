import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
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

    // Query user by email
    const userRows = await sql`
      SELECT id, email, password_hash, salt FROM users WHERE lower(email) = ${cleanEmail} LIMIT 1
    `;

    if (userRows.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const user = userRows[0];
    const isMatch = verifyPassword(password, user.password_hash, user.salt);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Fetch partner profile
    const profileRows = await sql`
      SELECT * FROM partner_profiles WHERE id = ${user.id} LIMIT 1
    `;
    const profile = profileRows.length > 0 ? profileRows[0] : null;

    // Set authenticated session cookie
    await setSessionCookie(user.id);

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email },
      profile,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to sign in";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ user: null });
    }

    const [rows] = await pool.query(
      "SELECT id, username, email FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: rows[0] });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to get user" },
      { status: 500 }
    );
  }
}
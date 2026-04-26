import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const cookieStore = await cookies();
    const followerId = cookieStore.get("userId")?.value;

    if (!followerId) {
      return NextResponse.json({ following: false });
    }

    const [rows] = await pool.query(
      "SELECT * FROM follows WHERE follower_id = ? AND following_id = ?",
      [followerId, id]
    );

    return NextResponse.json({
      following: rows.length > 0
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
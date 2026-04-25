import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";

export async function POST(req, context) {
  try {
    const { id } = await context.params;

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    // toggle like
    const [existing] = await pool.query(
      "SELECT * FROM likes WHERE user_id = ? AND post_id = ?",
      [userId, id]
    );

    if (existing.length > 0) {
      await pool.query(
        "DELETE FROM likes WHERE user_id = ? AND post_id = ?",
        [userId, id]
      );
      return NextResponse.json({ liked: false });
    } else {
      await pool.query(
        "INSERT INTO likes (user_id, post_id) VALUES (?, ?)",
        [userId, id]
      );
      return NextResponse.json({ liked: true });
    }

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to like" }, { status: 500 });
  }
}
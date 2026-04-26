import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";

export async function POST(req, { params }) {
  try {
    const { id } = await params; // user being followed

    const cookieStore = await cookies();
    const followerId = cookieStore.get("userId")?.value;

    if (!followerId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    if (String(followerId) === String(id)) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    // check if already following
    const [existing] = await pool.query(
      "SELECT * FROM follows WHERE follower_id = ? AND following_id = ?",
      [followerId, id]
    );

    if (existing.length > 0) {
      // unfollow
      await pool.query(
        "DELETE FROM follows WHERE follower_id = ? AND following_id = ?",
        [followerId, id]
      );
      return NextResponse.json({ following: false });
    } else {
      // follow
      await pool.query(
        "INSERT INTO follows (follower_id, following_id) VALUES (?, ?)",
        [followerId, id]
      );
      return NextResponse.json({ following: true });
    }

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to follow" }, { status: 500 });
  }
}
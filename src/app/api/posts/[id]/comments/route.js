import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";

export async function GET(req, context) {
  try {
    const { id } = await context.params;

    const [rows] = await pool.query(`
      SELECT comments.id, comments.content, users.username
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = ?
      ORDER BY comments.created_at ASC
    `, [id]);

    return NextResponse.json({ comments: rows });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 });
  }
}

export async function POST(req, context) {
  try {
    const { id } = await context.params;
    const { content } = await req.json();

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    await pool.query(
      "INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)",
      [userId, id, content]
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to comment" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const [rows] = await pool.query(`
      SELECT users.id, users.username
      FROM follows
      JOIN users ON follows.following_id = users.id
      WHERE follows.follower_id = ?
    `, [id]);

    return NextResponse.json({ users: rows });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
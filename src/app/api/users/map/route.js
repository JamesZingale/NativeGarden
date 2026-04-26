import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT id, username, latitude, longitude, location_name
      FROM users
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    `);

    return NextResponse.json({ users: rows });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load map users" },
      { status: 500 }
    );
  }
}
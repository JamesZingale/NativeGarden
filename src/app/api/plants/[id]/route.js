import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req, context) {
  try {
    const { id } = await context.params; // <-- FIX HERE

    const [rows] = await pool.query(
      "SELECT * FROM plants WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Plant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch plant" },
      { status: 500 }
    );
  }
}
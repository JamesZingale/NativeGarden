import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT common_name, scientific_name, state FROM plants LIMIT 20"
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Database query failed" }, { status: 500 });
  }
}
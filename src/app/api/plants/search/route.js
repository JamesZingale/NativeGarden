import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query) {
      return NextResponse.json({ plants: [] });
    }

    const [plants] = await pool.query(
      `
      SELECT id, common_name, scientific_name
      FROM plants
      WHERE common_name LIKE ?
         OR scientific_name LIKE ?
      LIMIT 20
      `,
      [`%${query}%`, `%${query}%`]
    );

    return NextResponse.json({ plants });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
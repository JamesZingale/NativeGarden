import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const state = searchParams.get("state");
    const page = parseInt(searchParams.get("page")) || 1;
    const search = searchParams.get("search") || "";

    const sun = searchParams.get("sun") || "";
    const soil = searchParams.get("soil") || "";
    const growth = searchParams.get("growth") || "";
    const color = searchParams.get("color") || "";

    const limit = 20;
    const offset = (page - 1) * limit;

    if (!state) {
      return NextResponse.json(
        { error: "State is required" },
        { status: 400 }
      );
    }

    // BUILD QUERY DYNAMICALLY
    let query = "FROM plants WHERE state = ?";
    let params = [state];

    if (search) {
      query += " AND common_name LIKE ?";
      params.push(`%${search}%`);
    }

    if (sun) {
      query += " AND sun_exposure LIKE ?";
      params.push(`%${sun}%`);
    }

    if (soil) {
      query += " AND soil_moisture LIKE ?";
      params.push(`%${soil}%`);
    }

    if (growth) {
      query += " AND growth_rate LIKE ?";
      params.push(`%${growth}%`);
    }

    if (color) {
      query += " AND flower_color LIKE ?";
      params.push(`%${color}%`);
    }

    // DATA QUERY
    const [plants] = await pool.query(
      `SELECT id, common_name, scientific_name ${query} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // COUNT QUERY
    const [[{ count }]] = await pool.query(
      `SELECT COUNT(*) as count ${query}`,
      params
    );

    return NextResponse.json({
      plants,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch plants" },
      { status: 500 }
    );
  }
}
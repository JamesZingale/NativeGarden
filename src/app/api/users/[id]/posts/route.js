import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req, context) {
  try {
    const { id } = await context.params;

    const [rows] = await pool.query(`
      SELECT 
        garden_posts.id,
        garden_posts.image_url,
        garden_posts.description,
        garden_posts.plant_id,
        plants.common_name
      FROM garden_posts
      JOIN plants ON garden_posts.plant_id = plants.id
      WHERE garden_posts.user_id = ?
      ORDER BY garden_posts.created_at DESC
    `, [id]);

    return NextResponse.json({ posts: rows });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load user posts" },
      { status: 500 }
    );
  }
}
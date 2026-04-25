import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ posts: [] });
    }

    const [posts] = await pool.query(`
      SELECT 
        garden_posts.*,
        plants.common_name,
        plants.scientific_name
      FROM garden_posts
      JOIN plants ON garden_posts.plant_id = plants.id
      WHERE garden_posts.user_id = ?
      ORDER BY garden_posts.created_at DESC
    `, [userId]);

    return NextResponse.json({ posts });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
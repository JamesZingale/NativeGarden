import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    const [rows] = await pool.query(`
      SELECT 
        gp.id,
        gp.image_url,
        gp.description,
        gp.plant_id,
        p.common_name,
        u.username,
        u.id AS user_id,

        COUNT(l.id) AS like_count,
        SUM(CASE WHEN l.user_id = ? THEN 1 ELSE 0 END) > 0 AS liked

      FROM garden_posts gp
      JOIN plants p ON gp.plant_id = p.id
      JOIN users u ON gp.user_id = u.id
      LEFT JOIN likes l ON gp.id = l.post_id

      ${userId ? "WHERE gp.user_id != ?" : ""}

      GROUP BY gp.id
      ORDER BY gp.created_at DESC
      LIMIT 50
    `, userId ? [userId, userId] : [null]);

    return NextResponse.json({ posts: rows });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load feed" }, { status: 500 });
  }
}
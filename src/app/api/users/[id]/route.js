import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const cookieStore = await cookies();
    const viewerId = cookieStore.get("userId")?.value;

    const [[user]] = await pool.query(
      "SELECT id, username FROM users WHERE id = ?",
      [id]
    );

    const [posts] = await pool.query(`
      SELECT 
        gp.id,
        gp.image_url,
        gp.description,
        gp.plant_id,
        gp.user_id,
        p.common_name,
        u.username,

        COUNT(l.id) AS like_count,

        EXISTS (
          SELECT 1 
          FROM likes l2 
          WHERE l2.post_id = gp.id 
            AND l2.user_id = ?
        ) AS liked

      FROM garden_posts gp
      JOIN plants p ON gp.plant_id = p.id
      JOIN users u ON gp.user_id = u.id
      LEFT JOIN likes l ON l.post_id = gp.id

      WHERE gp.user_id = ?

      GROUP BY gp.id
      ORDER BY gp.created_at DESC
    `, [viewerId || 0, id]);

    return NextResponse.json({
      user,
      posts
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load user data" },
      { status: 500 }
    );
  }
}
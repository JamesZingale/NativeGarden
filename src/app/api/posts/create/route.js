import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Not logged in" },
        { status: 401 }
      );
    }

    const { plant_id, image_url, description } = await req.json();

    if (!plant_id) {
      return NextResponse.json(
        { error: "Plant is required" },
        { status: 400 }
      );
    }

    await pool.query(
      "INSERT INTO garden_posts (user_id, plant_id, image_url, description) VALUES (?, ?, ?, ?)",
      [userId, plant_id, image_url, description]
    );

    return NextResponse.json({ message: "Post created" });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
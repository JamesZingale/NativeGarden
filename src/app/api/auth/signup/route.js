import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const {
      username,
      email,
      password,
      latitude,
      longitude,
      location_name
    } = await req.json();

    // HASH PASSWORD (THIS WAS MISSING)
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `
      INSERT INTO users 
      (username, email, password, latitude, longitude, location_name) 
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        username,
        email,
        hashedPassword, // ✅ FIXED
        latitude || null,
        longitude || null,
        location_name || null
      ]
    );

    return NextResponse.json({ message: "User created" });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Signup failed" },
      { status: 500 }
    );
  }
}
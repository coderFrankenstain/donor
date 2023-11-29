import { NextResponse, NextRequest } from "next/server";
import pool from "../../db/db"; // 确保路径正确

export async function POST(request) {
  const { username, password } = await request.json();
  try {
    const sql = "SELECT * FROM user WHERE username = ? AND password = ?";
    const [users] = await pool.query(sql, [username, password]);
    if (users.length > 0) {
      var user = users[0];
      console.log("用户id 为 ", user);
      return NextResponse.json({ code: 200, data: user });
    } else {
      return NextResponse.json({ code: -1 });
    }
  } catch (error) {
    console.error("Insertion error:", error);
    return NextResponse.json({ code: -1 });
  }
}

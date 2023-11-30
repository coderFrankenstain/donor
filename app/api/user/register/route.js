import { NextResponse } from "next/server";
import pool from "../../db/db"; // 确保路径正确

export async function POST(request) {
  const { username, password, type } = await request.json();

  // 检查用户名是否已存在
  try {
    const checkSql = "SELECT * FROM user WHERE username = ?";
    const [users] = await pool.query(checkSql, [username]);
    if (users.length > 0) {
      // 用户名已存在
      return NextResponse.json({ code: -1, message: "用户名已存在" });
    }

    // 插入新用户
    const insertSql =
      "INSERT INTO user (username, password,type,score) VALUES (?,?,?,?)";
    const [user] = await pool.query(insertSql, [
      username,
      password,
      type,
      1000,
    ]);
    return NextResponse.json({ code: 200, message: "注册成功" });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ code: -1, message: "注册失败" });
  }
}

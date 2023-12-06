import { NextResponse, NextRequest } from "next/server";
import pool from "../db/db"; // 确保路径正确

// 模拟一个全局的存储对象
let donor = { score: 10 };
let provider = { score: 10 };

export async function GET(request) {
  const userId = request.nextUrl.searchParams.get("userId");

  try {
    const sql = "SELECT * FROM user WHERE id = ? ";
    const [users] = await pool.query(sql, [userId]);
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

export async function POST(request) {
  const { creatorId, score } = await request.json();

  const sql = `
  UPDATE user
  SET  score = score + ?
  WHERE id = ?
  `;
  const result = await pool.query(sql, [score, creatorId]);

  return NextResponse.json({ status: 200, result: result });
}

export async function UPDATE(request) {
  console.log("接受到请求");
  try {
    const { id, address } = await request.json();

    const sql = `
    UPDATE user
    SET  address = ?
    WHERE id = ?
    `;
    const result = await pool.query(sql, [address, id]);

    return NextResponse.json({ status: 200, result: result });
  } catch (error) {
    console.error("Insertion error:", error);
    return NextResponse.json({ code: -1 });
  }
}

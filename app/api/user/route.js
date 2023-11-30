import { NextResponse, NextRequest } from "next/server";
import pool from "../db/db"; // 确保路径正确

// 模拟一个全局的存储对象
let donor = { score: 10 };
let provider = { score: 10 };

export async function GET(request) {
  const name = request.nextUrl.searchParams.get("name");
  let user;
  if (name == "donor") {
    user = donor;
  } else {
    user = provider;
  }
  console.log("score ", user);
  return NextResponse.json({ score: user.score });
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

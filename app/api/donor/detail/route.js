import { NextResponse } from "next/server";
import pool from "../../db/db"; // 确保路径正确

//交互端点
export async function POST(request) {
  const { id } = await request.json();
  var sql = `SELECT * FROM item where id=${id}`;
  const [users] = await pool.query(sql);
  console.log("查询结果 ", users);
  return NextResponse.json({ status: 200, data: users });
}

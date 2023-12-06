import { NextResponse, NextRequest } from "next/server";
import pool from "../../db/db"; // 确保路径正确

export async function POST(request) {
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
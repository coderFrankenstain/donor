import { NextResponse } from "next/server";
import pool from "../db/db"; // 确保路径正确

let donor = [];
//生成

//新增
export async function POST(request) {
  //添加新商品
  const { title, status, image, creatorId, content } =
    await request.json();
  // 插入新用户
  const insertSql =
    "INSERT INTO item (title, status,image,creatorId,content) VALUES (?, ?,?,?,?)";
  const [results, fields] = await pool.query(insertSql, [
    title,
    status,
    image,
    creatorId,
    content,
  ]);
  const insertedId = results.insertId;

  return NextResponse.json({ status: 200, data: insertedId });
}

//查询
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const creatorId = searchParams.get("creatorId");
  const ownerId = searchParams.get("ownerId")
  var sql;
  if (creatorId) {
    sql = `SELECT * FROM item where type=0 and creatorId=${creatorId}`;
  } else {
    sql = "SELECT * FROM item where type=0";
  }
  if(ownerId) {
    sql = `SELECT * FROM item where type=0 and ownerId=${ownerId}`;
  }

  const [users] = await pool.query(sql);
  console.log("查询结果 ", users);
  return NextResponse.json({ status: 200, data: users });
}

//修改
export async function PUT(request) {
  const { id, status, ownerId } = await request.json();

  let sql;
  let result;
  if (ownerId === undefined) {
    sql = `
    UPDATE item
    SET  status = ?
    WHERE id = ?
    `;
    result = await pool.query(sql, [status, id]);
    return NextResponse.json({ status: 200, data: result });

  } else {
    sql = `
    UPDATE item
    SET ownerId = ?, status = ?
    WHERE id = ?
    `;
    result = await pool.query(sql, [ownerId, status, id]);
    return NextResponse.json({ status: 200, data: result });

  }
}

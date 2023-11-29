import { NextResponse } from "next/server";
import pool from "../db/db"; // 确保路径正确

const { v4: uuidv4 } = require("uuid");

let images = [
  "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
  "https://images.pexels.com/photos/4495705/pexels-photo-4495705.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
  "https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
  "https://images.pexels.com/photos/179909/pexels-photo-179909.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
  "https://images.pexels.com/photos/5705478/pexels-photo-5705478.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
];

function randomUrl() {
  let imageUrl = images[Math.floor(Math.random() * images.length)];
  return imageUrl;
}

let donor = [];
//生成

//交互端点
export async function POST(request) {
  //添加新商品
  const { title, status, image, creatorId, content, ownerId } =
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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const creatorId = searchParams.get("creatorId");
  var sql;
  if (creatorId) {
    sql = `SELECT * FROM item where type=0 and creatorId=${creatorId}`;
  } else {
    sql = "SELECT * FROM item where type=0";
  }

  const [users] = await pool.query(sql);
  console.log("查询结果 ", users);
  return NextResponse.json({ status: 200, data: users });
}

export async function PUT(request) {
  const { uuid, status, address } = await request.json();
  donor = donor.map((value) =>
    value.uuid === uuid ? { ...value, status: status, address: address } : value
  );
  console.log("donor", donor);
  return NextResponse.json(donor);
}

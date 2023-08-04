import { NextResponse } from "next/server";
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
console.log("你好", donor);

//生成

//交互端点
export async function POST(request) {
  const { name, status } = await request.json();
  donor.push({
    name,
    status,
    uuid: uuidv4(),
    url: randomUrl(),
  });
  return NextResponse.json({ status: 200 });
}

export async function GET(request) {
  return NextResponse.json(donor);
}

export async function PUT(request) {
  const { uuid, status } = await request.json();
  donor = donor.map((value) =>
    value.uuid === uuid ? { ...value, status: status } : value
  );
  console.log("donor", donor);
  return NextResponse.json(donor);
}

import { NextResponse } from "next/server";
const { v4: uuidv4 } = require("uuid");

let images = [
  "https://images.pexels.com/photos/17397677/pexels-photo-17397677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/620337/pexels-photo-620337.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/1619319/pexels-photo-1619319.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/10643872/pexels-photo-10643872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];

function randomUrl() {
  let imageUrl = images[Math.floor(Math.random() * images.length)];
  return imageUrl;
}

let digitals = [];

//生成

//交互端点
export async function POST(request) {
  const { name, status } = await request.json();
  digitals.push({
    name,
    status,
    uuid: uuidv4(),
    url: randomUrl(),
  });
  return NextResponse.json({ status: 200 });
}

export async function GET(request) {
  return NextResponse.json(digitals);
}

export async function PUT(request) {
  const { uuid } = await request.json();
  digitals = digitals.map((value) =>
    value.uuid === uuid ? { ...value, status: 1 } : value
  );
  console.log("digitals", digitals);
  return NextResponse.json(digitals);
}

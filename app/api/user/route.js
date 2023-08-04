import { NextResponse, NextRequest } from "next/server";

// 模拟一个全局的存储对象
let donor = { score: 10 };
let provider = { score: 10 };
console.log("我去");
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
  const { name } = await request.json();
  if (name == "donor") {  //兑换
    donor = { score: donor.score - 1 };
    provider = { score: provider.score + 1 };
  } else {   //捐赠成功
    donor = { score: donor.score + 1 };
  }

  return NextResponse.json({ status: 200 });
}

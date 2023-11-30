"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Space, Card, Button, message } from "antd";
import Link from "next/link";
// 在这个上下文中，我们可以为这三类用户取一些相关的、描述性的名字：

// A用户：物品捐赠者（Item Donor）或者公益提供者（Philanthropic Provider）

// B用户：受助者（Beneficiary）或者物品接收者（Item Recipient）

// C用户：数字创作者（Digital Creator）或者作品提供者（Content Provider）

const Role = [
  { name: "物品捐赠者" },
  { name: "受助者" },
  { name: "数字创作者" },
];

function UserCard({ user, link }) {
  return (
    <Link href={link}>
      <Card
        hoverable
        className=" flex-center"
        style={{ width: 300, height: 400 }}
      >
        {/* <p style={{ textAlign: "center", fontSize: "100px" }}>Card content</p> */}
        <p
          style={{
            textAlign: "center",
            fontSize: "30px",
            color: "rgb(144, 144, 144)",
          }}
        >
          {user.name}
        </p>
      </Card>
    </Link>
  );
}

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/login");
  }, []);

  return (
    <div className="home">
      <div className="text-primary-orange">正在跳转</div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { Button, Card, Col, Input, Row, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import Image from "next/image";

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const DetailPage = ({ params }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [item, setItem] = useState(null);
  const cloudId = params.cid;

  const getItem = async (value) => {
    console.log("请求参数 ", value);
    const response = await fetch(`/api/donor/detail`, {
      method: "POST",
      body: JSON.stringify(value),
    });
    const data = await response.json();
    const items = data.data;
    console.log("响应的数据 ", items[0]);
    setItem(items[0]);
  };

  useEffect(() => {
    const userData = sessionStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Handle case where there is no user data (e.g., redirect to login)
      router.push("/login");
    }
    getItem({ id: cloudId });
  }, [router]);

  const purchase = async () => {
    if (item.creatorId === user.id) {
      message.error("不能购买自己的发布的商品");
      return;
    }

    const response = await fetch("/api/donor", {
      method: "PUT",
      body: JSON.stringify({
        id: item.id,
        ownerId: user.id,
        status: 1,
      }),
    });

    let data = await response.json();
    if (data.status == 200) {
      console.log("购买成功");

      fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({
          creatorId: user.id,
          score: -item.score,
        }),
      });

      message.success("购买成功");
      router.back();
    }
  };

  return (
    <div style={{ width: "70vw", margin: "auto" }}>
      <Typography>
        <Title level={4}>物品详情</Title>
        <Paragraph>
          物品名称: {item && item.title} <br />
          发布人: {item && item.id} 号 <br />
          积分点数: {item && item.score}
        </Paragraph>
      </Typography>
      <Row gutter={16}>
        <Card title={`物品照片`} bordered={false}>
          {item ? (
            <Image
              src={item && item.image}
              alt={item && item.title}
              width={200}
              height={200}
              unoptimized={true}
            />
          ) : (
            <></>
          )}
          {/* <Image
            src={item && item.image}
            alt={item && item.title}
            width={200}
            height={200}
            unoptimized={true}
          /> */}
        </Card>
      </Row>
      <Card title="物品描述" style={{ marginTop: "20px" }}>
        <p>{item && item.content}</p>
      </Card>
      <Button onClick={purchase} type="primary" style={{ marginTop: "20px" }}>
        我要购买
      </Button>
    </div>
  );
};

export default DetailPage;

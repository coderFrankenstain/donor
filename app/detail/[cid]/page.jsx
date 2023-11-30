"use client";
import React, { useState, useEffect } from "react";
import { Button, Card, Col, Input, Row, Typography } from "antd";
import { useRouter } from "next/navigation";

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
        {Array.from({ length: 1 }, (_, index) => (
          <Col span={6} key={index}>
            <Card title={`物品照片 ${index + 1}`} bordered={false}>
              {/* 这里应该放置图片内容 */}
            </Card>
          </Col>
        ))}
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

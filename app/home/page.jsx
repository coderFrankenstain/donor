"use client";
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Tabs, Layout, Button, Space } from "antd";
import { useRouter } from "next/navigation";
import Image from "next/image";

const { Header, Content, Footer } = Layout;
const { TabPane } = Tabs;

const HomePage = () => {
  const [data, setData] = useState([]);
  const [user , serUser] = useState();
  const router = useRouter();

  useEffect(() => {
    let temp = JSON.parse(sessionStorage.getItem("userData"));
    serUser(temp)

    getDonor();
  }, []);

  const handleManager = () => {
    //0 表示捐赠者， 1表示受助者 2表示数字艺术家
    if (user.type == 0) {
      router.push("/donor/add");
    } else if (user.type == 1) {
      router.push("/recipient");
    } else {
      router.push("/content-provider");
    }
  };

  const getDonor = async () => {
    const response = await fetch(`/api/donor`, {
      method: "GET",
    });
    const data = await response.json();
    const result = data.data.filter((record) => record.status === 0);
    console.log("back data ", result);

    setData(result);
  };

  const getDigital = () => {};

  // 示例用户信息
  const userInfo = (
    <Header
      style={{
        height: "200px",
        background: "#f0f2f5",
        color: "black",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "start",
      }}
    >
      <div style={{ padding: "16px 0" }}>
        {" "}
        {/* 这里添加了垂直内边距 */}
        <h1 style={{ height: "32px", margin: "0 0 16px 0" }}>
          用户名: {user && user.username}
        </h1>{" "}
        {/* 添加了底部外边距 */}
        <p style={{ height: "32px", margin: "0 0 8px 0" }}>
          用户类型:{" "}
          {user && user.type > 0
            ? user.type > 1
              ? "数字艺术家"
              : "受助者"
            : "捐赠者"}
        </p>{" "}
        {/* 添加了底部外边距 */}
        <p style={{ height: "32px", margin: "0" }}>
          用户积分: {user && user.score}
        </p>{" "}
        <p style={{ height: "32px", margin: "0" }}>
          <Space>
            <Button
              onClick={() => {
                handleManager();
              }}
            >
              {" "}
              管理页面{" "}
            </Button>
          </Space>
        </p>{" "}
        {/* 如果需要，也可以调整这里的间距 */}
      </div>
    </Header>
    // ...
  );

  const handleTapChange = (activateKey) => {
    console.log("当前选中 ", activateKey);
    if (activateKey == 1) {
      //捐赠物品
    } else {
      //数字艺术品
    }
  };

  // 根据你的设计，添加捐赠物品和数字藏品选项卡
  const donationTabs = (
    <Tabs
      defaultActiveKey="1"
      style={{ margin: "20px 0" }}
      onChange={handleTapChange}
    >
      <TabPane tab="捐赠物品" key="1">
        {/* 这里填充捐赠物品的内容 */}
        <p>捐赠物品内容</p>
      </TabPane>
      <TabPane tab="数字藏品" key="2">
        {/* 这里填充数字藏品的内容 */}
        <p>数字藏品内容</p>
      </TabPane>
    </Tabs>
  );

  // 假设你想要一个包含11个卡片的布局，每行四个卡片
  const cardList = (
    <Row gutter={16}>
      {data.map((record, index) => (
        <Col key={index} span={6} style={{ padding: "8px" }}>
          <Card
            title={`${record.title}`}
            bordered={false}
            style={{ backgroundColor: "#f0f2f5" }}
            onClick={() => {
              router.push(`/detail/${record.id}`);
            }}
          >
            <Image
            src={record.image}
            alt={record.title}
            width={200}
            height={200}
            unoptimized={true}
          />
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <Layout style={{ width: "70vw", margin: "auto" }}>
      {userInfo}
      <Content style={{ padding: "0 50px", backgroundColor: "white" }}>
        {donationTabs}
        {cardList}
      </Content>
    </Layout>
  );
};

export default HomePage;

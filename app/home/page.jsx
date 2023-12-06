"use client";
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Tabs,
  Layout,
  Button,
  Space,
  Modal,
  theme,
  Input,
} from "antd";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { AppName } from "@/constant";


const { confirm } = Modal;

const { Header, Content, Footer } = Layout;
const { TabPane } = Tabs;

const HomePage = () => {
  const [data, setData] = useState([]);
  const [user, serUser] = useState();
  const router = useRouter();
  const [address,setAddress] = useState('')
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    let temp = JSON.parse(sessionStorage.getItem("userData"));
    serUser(temp);

    getDonor();
    getUser(temp.id);
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

  const getDigital = async () => {
    const response = await fetch(`/api/digital`, {
      method: "GET",
    });

    const data = await response.json();
    const result = data.data.filter((record) => record.status === 0);
    console.log("back data ", result);
    setData(result);
  };

  const getUser = async (userId) => {
    const response = await fetch(`/api/user?userId=${userId}`, {
      method: "GET",
    });
    const result = await response.json();
    if (result.code == 200) {
      console.log("user login data ", result.data);
      const userdata = JSON.stringify(result.data);
      sessionStorage.setItem("userData", userdata);
      serUser(result.data);
    } else {
      message.error("登录失败");
    }
  };

  const handleChange = (e) => {
    setAddress(e.target.value);
  };

  const showConfirm = () => {
    let tempAddress = "";  // 局部变量来临时存储地址
  
    confirm({
      title: "请输入收货地址",
      icon: <ExclamationCircleFilled />,
      content: (
        <Input
          placeholder="请输入内容"
          defaultValue={address}
          onChange={(e) => tempAddress = e.target.value}
        />
      ),
      onOk() {
        setAddress(tempAddress);  // 使用局部变量的值更新状态
        console.log("OK ", tempAddress);  // 现在这里会显示最新的输入值

        const updateUser = async () => {
          const response = await fetch(`/api/user/address`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              // 如果需要，可以添加更多的头部信息，如认证令牌等
          },
            body: JSON.stringify({
              "id":user.id,
              "address":tempAddress
            })
          });
          const result = await response.json();
          getUser(user.id)
        }

        updateUser();

      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleTapChange = (activateKey) => {
    console.log("当前选中 ", activateKey);
    if (activateKey == 1) {
      //捐赠物品
      getDonor();
    } else {
      //数字艺术品
      getDigital();
    }
  };

  // 根据你的设计，添加捐赠物品和数字藏品选项卡
  const donationTabs = (
    <div>
      <Space size="middle" style={{ color: "black", fontSize: "20px" }}>
        <div> 用户名: {user && user.username}</div>
        <p>
          用户类型:{" "}
          {user && user.type > 0
            ? user.type > 1
              ? "数字艺术家"
              : "受助者"
            : "捐赠者"}
        </p>
        <p style={{}}>用户积分: {user && user.score}</p>
        <Button
          onClick={() => {
            handleManager();
          }}
        >
          {" "}
          管理页面{" "}
        </Button>
      </Space>
      <div style={{ color: "black", fontSize: "15px" }}>
        用户地址: {(user && user.address) || ""}{" "}
        <Button onClick={showConfirm}>修改地址</Button>
      </div>
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
    </div>
  );

  // 假设你想要一个包含11个卡片的布局，每行四个卡片
  const cardList = (
    <div style={{ height: "500px", overflowY: "auto", overflowX: "hidden" }}>
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
    </div>
  );

  return (
    <Layout style={{ width: "70vw", margin: "auto" }}>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="demo-logo" />
        <h1 style={{ color: "white" }}>       {AppName}</h1>
       
      </Header>

      <Content
        className="site-layout"
        style={{
          padding: "20px 50px",
        }}
      >
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
          }}
        >
          {donationTabs}
          {cardList}
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
               {AppName}
      </Footer>
    </Layout>
  );
};

export default HomePage;

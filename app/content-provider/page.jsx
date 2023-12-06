"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  message,
  Space,
  Table,
  Upload,
  Layout,
  theme,
} from "antd";
import Image from "next/image";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { AppName } from "@/constant";
const { Header, Content, Footer } = Layout;

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};
// 请求方法

const AddPage = () => {
  const [data, setData] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemScore, setItemScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [userData, setUserData] = useState(null);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const getDigital = async (userId) => {
    const response = await fetch(`/api/digital?creator=${userId}`, {
      method: "GET",
    });
    const data = await response.json();
    setData(data.data);
  };

  const getUser = async () => {
    const reponse = await fetch("/api/user?name=provider", {
      method: "GET",
    });
    const resp = await reponse.json();
    console.log("ad ", resp);
    setItemScore(resp.score);
  };

  const addDigital = async (digital) => {
    const response = await fetch("/api/digital", {
      method: "POST",
      body: JSON.stringify(digital),
    });
    await response.json();
    await getDigital(userData.id);
    setItemName("");
    setItemDesc("");
    setItemScore("");
  };

  const handleItemNameChange = (e) => {
    setItemName(e.target.value);
  };

  const handleItemDescChange = (e) => {
    setItemDesc(e.target.value);
  };

  const handleItemScoreChange = (e) => {
    setItemScore(e.target.value);
  };

  useEffect(() => {
    let temp = JSON.parse(sessionStorage.getItem("userData"));
    setUserData(temp);

    getDigital(temp.id);
    getUser();
  }, []);

  const columns = [
    {
      title: "图片",
      dataIndex: "url",
      key: "url",
      render: (text, record) => {
        return (
          <Image
            src={record.image}
            alt={record.title}
            width={200}
            height={150}
            unoptimized={true}
          />
        );
      },
    },
    {
      title: "名称",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        let status = "";
        if (record.status === 0) {
          status = "未兑换";
        } else if (record.status == 1) {
          status = "已兑换";
        }
        return <p>{status}</p>;
      },
    },
  ];

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      const response = info.file.response;

      // 例如，如果服务器返回的JSON对象中有一个名为"path"的属性
      const path = response.path;

      // 你现在可以使用这个"path"值做任何你想做的事
      console.log(path);
      setImageUrl("/upload/" + path);
    }
  };

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
        <h1 style={{ color: "white" }}> {AppName}</h1>
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "80%",
            }}
          >
            <h1>发布数字艺术品</h1>
            <p>用户当前当前积分 {userData && userData.score}</p>

            <Space style={{ width: "40%" }} direction="vertical" size="large">
              <Input
                value={itemName}
                placeholder="请输入名称"
                onChange={handleItemNameChange}
              />
              <Input
                value={itemDesc}
                placeholder="请输入描述"
                onChange={handleItemDescChange}
              />
              <Input
                value={itemScore}
                placeholder="请输入点数"
                onChange={handleItemScoreChange}
              />
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="/api/upload"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    <Image
                      src={imageUrl}
                      alt="avatar"
                      layout="fill"
                      unoptimized={true}
                    ></Image>
                  </div>
                ) : (
                  uploadButton
                )}
              </Upload>
              <Button
                style={{ width: "100%" }}
                type="primary"
                onClick={() => {
                  if (itemName === "") {
                    message.error("请输入物品名称");
                    return;
                  }
                  addDigital({
                    title: itemName,
                    status: 0,
                    image: imageUrl || "",
                    creatorId: userData.id,
                    content: itemDesc,
                    score: itemScore,
                  });
                }}
              >
                发布
              </Button>
            </Space>
            </div>
            <Table
              style={{
                width: "100%",
                height: "500px",
                marginTop: "30px",
              }}
              columns={columns}
              dataSource={data}
              pagination={false}
              scroll={{ y: 400 }}
            />
          
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

export default AddPage;

{
  /* <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "80%",
      }}
    >
      <h1>发布数字艺术品</h1>
      <p>用户当前当前积分 {userData && userData.score}</p>

      <Space style={{ width: "40%" }} direction="vertical" size="large">
        <Input
          value={itemName}
          placeholder="请输入名称"
          onChange={handleItemNameChange}
        />
        <Input
          value={itemDesc}
          placeholder="请输入描述"
          onChange={handleItemDescChange}
        />
        <Input
          value={itemScore}
          placeholder="请输入点数"
          onChange={handleItemScoreChange}
        />
        <Upload
          name="file"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="/api/upload"
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? (
            <div
              style={{ width: "100%", height: "100%", position: "relative" }}
            >
              <Image
                src={imageUrl}
                alt="avatar"
                layout="fill"
                unoptimized={true}
              ></Image>
            </div>
          ) : (
            uploadButton
          )}
        </Upload>
        <Button
          style={{ width: "100%" }}
          type="primary"
          onClick={() => {
            if (itemName === "") {
              message.error("请输入物品名称");
              return;
            }
            addDigital({
              title: itemName,
              status: 0,
              image: imageUrl || "",
              creatorId: userData.id,
              content: itemDesc,
              score: itemScore,
            });
          }}
        >
          发布
        </Button>
      </Space>
      <Table
        style={{
          width: "100%",
          height: "600px",
          marginTop: "30px",
        }}
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ y: 600 }}
      />
    </div> */
}

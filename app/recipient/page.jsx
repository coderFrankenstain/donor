"use client";
import React, { useEffect, useState } from "react";
import {
  Upload,
  Button,
  Input,
  message,
  Space,
  Table,
  Layout,
  theme,
} from "antd";
import Image from "next/image";
import AddressSelectModal from "@/components/AddressSelect";
import { AppName } from "@/constant";
// 请求方法
const { Header, Content, Footer } = Layout;

const Page = () => {
  const [data, setData] = useState([]);
  const [itemName, setItemName] = useState("");
  const [user, setUser] = useState(null);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const getDonor = async (id) => {
    const response = await fetch(`/api/donor?ownerId=${id}`, {
      method: "GET",
    });
    const data = await response.json();
    console.log("data is ", data);
    setData(data.data);
  };

  const handleAddressSelected = (address, changeUid) => {
    //本地更改
    setData(
      data.map((value) =>
        value.uuid == changeUid ? { ...value, status: 1 } : value
      )
    );
    //同时上传后端接口
    fetch("/api/donor", {
      method: "PUT",
      body: JSON.stringify({ uuid: changeUid, status: 2 }),
    });
  };

  const handleItemNameChange = (e) => {
    setItemName(e.target.value);
  };

  useEffect(() => {
    // getDonor();
    let userData = JSON.parse(sessionStorage.getItem("userData"));
    setUser(userData);

    console.log("user is", userData);
    getDonor(userData.id);
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
          status = "未捐赠";
        } else if (record.status === 1) {
          status = "等待发货";
        } else if (record.status == 2) {
          status = "已发货";
        } else {
          status = "已收货";
        }
        return <p>{status}</p>;
      },
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) =>
        record.status === 0 ? (
          <AddressSelectModal
            trigger={(address) => {
              const changeUid = record.uuid;
              const status = record.status + 1;
              //本地更改
              setData(
                data.map((value) =>
                  value.uuid === changeUid
                    ? { ...value, status: status }
                    : value
                )
              );

              //同时上传后端接口
              fetch("/api/donor", {
                method: "PUT",
                body: JSON.stringify({
                  uuid: changeUid,
                  status: status,
                  address: address,
                }),
              });

              console.log(`上传的地址 ${address}`);
            }}
          ></AddressSelectModal>
        ) : (
          <Button
            disabled={record.status !== 0 && record.status !== 2}
            onClick={() => {
              const changeUid = record.id;
              const status = record.status + 1;
              //本地更改
              setData(
                data.map((value) =>
                  value.uuid === changeUid
                    ? { ...value, status: status }
                    : value
                )
              );

              //同时上传后端接口
              fetch("/api/donor", {
                method: "PUT",
                body: JSON.stringify({ id: changeUid, status: status }),
              });

              //如果是收货，则为donor增加积分
              if (status === 3) {
                fetch("/api/user", {
                  method: "POST",
                  body: JSON.stringify({
                    creatorId: record.creatorId,
                    score: 100,
                  }),
                });
              }
            }}
          >
            {record.status === 2 ? "确认收货" : "完成"}
          </Button>
        ),
    },
  ];

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
          <h1>选择公益品</h1>
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

export default Page;

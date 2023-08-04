"use client";
import React, { useEffect, useState } from "react";
import { Button, Input, message, Space, Table } from "antd";
import Image from "next/image";
// 请求方法

const AddPage = () => {
  const [data, setData] = useState([]);
  const [itemName, setItemName] = useState("");
  const [score, setScore] = useState(10);

  const getDigital = async () => {
    const response = await fetch("/api/digital", {
      method: "GET",
    });
    const data = await response.json();
    setData(data);
  };

  const addDigital = async (digital) => {
    const response = await fetch("/api/digital", {
      method: "POST",
      body: JSON.stringify(digital),
    });
    await response.json();
    await getDigital();
    setItemName("");

    //增加积分
    setScore(score + 1);
  };

  const handleItemNameChange = (e) => {
    setItemName(e.target.value);
  };

  useEffect(() => {
    getDigital();
  }, []);

  const columns = [
    {
      title: "图片",
      dataIndex: "url",
      key: "url",
      render: (text, record) => {
        return (
          <Image src={record.url} alt={record.name} width={200} height={150} />
        );
      },
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "80%",
      }}
    >
      <h1>发布数字艺术品</h1>
      <p>用户当前当前积分 {score}</p>

      <Space style={{ width: "40%" }} direction="vertical" size="large">
        <Input
          value={itemName}
          placeholder="请输入名称"
          onChange={handleItemNameChange}
        />

        <Button
          style={{ width: "100%" }}
          type="primary"
          onClick={() => {
            if (itemName === "") {
              message.error("请输入物品名称");
              return;
            }
            addDigital({ name: itemName, status: 0 });
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
    </div>
  );
};

export default AddPage;

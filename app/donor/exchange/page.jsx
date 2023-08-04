"use client";
import React, { useEffect, useState } from "react";
import { Upload, Button, Input, message, Space, Table } from "antd";
import Image from "next/image";
import AddressSelectModal from "@/components/AddressSelect";
// 请求方法

const ExchangePage = () => {
  const [data, setData] = useState([]);
  const [score, setScore] = useState(10);

  const getDigital = async () => {
    const response = await fetch("/api/digital", {
      method: "GET",
    });
    const data = await response.json();
    setData(data);
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
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <Button
          disabled={record.status === 1}
          onClick={() => {
            //检查用户积分是否足够
            if (score <= 0) {
              message.error("当前用户积分不足");
              return;
            }

            //积分足够,减少积分
            setScore(score - 1);

            const changeUid = record.uuid;
            //更改兑换物品状态
            setData(
              data.map((value) =>
                value.uuid == changeUid ? { ...value, status: 1 } : value
              )
            );
            //同时上传后端接口
            fetch("/api/digital", {
              method: "PUT",
              body: JSON.stringify({ uuid: changeUid }),
            });
          }}
        >
          兑换
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>兑换数字艺术品</h1>
      <Space direction="vertical" size="large">
        <p>用户当前当前积分 {score}</p>
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

export default ExchangePage;

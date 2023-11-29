"use client";
import React, { useEffect, useState } from "react";
import { Upload, Button, Input, message, Space, Table } from "antd";
import Image from "next/image";
import AddressSelectModal from "@/components/AddressSelect";
// 请求方法

const Page = () => {
  const [data, setData] = useState([]);
  const [itemName, setItemName] = useState("");

  const getDonor = async () => {
    const response = await fetch("/api/donor", {
      method: "GET",
    });
    const data = await response.json();
    setData(data);
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
                body: JSON.stringify({ uuid: changeUid, status: status }),
              });

              //如果是收货，则为donor增加积分
              if (status === 3) {
                fetch("/api/user", {
                  method: "POST",
                  body: JSON.stringify({ name: "recipient" }),
                });
              }
            }}
          >
            {record.status === 2 ? "确认收货" : "获取"}
          </Button>
        ),
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
      <h1>选择公益品</h1>
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

export default Page;

"use client";
import React, { useEffect, useState } from "react";
import { Upload, Button, Input, message, Space, Table } from "antd";
import Image from "next/image";
import AddressSelectModal from "@/components/AddressSelect";
// 请求方法

const AddPage = () => {
  const [data, setData] = useState([]);
  const [itemName, setItemName] = useState("");

  const getDonor = async () => {
    const response = await fetch("/api/donor", {
      method: "GET",
    });
    const data = await response.json();
    setData(data);
  };

  const addDonor = async (donor) => {
    const response = await fetch("/api/donor", {
      method: "POST",
      body: JSON.stringify(donor),
    });
    await response.json();
    await getDonor();
    setItemName("");
  };

  const handleAddressSelected = (address, changeUid) => {
    //本地更改
    setData(
      data.map((value) =>
        value.uuid == changeUid ? { ...value, status: 2 } : value
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
    getDonor();
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
          status = "已捐赠";
        } else if(record.status == 2){
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
      render: (text, record) => (
        <AddressSelectModal
          trigger={(address) => {
            if (record.status !== 1) {
              message.error("该物品未捐赠");
              return;
            }

            handleAddressSelected(address, record.uuid);
          }}
        />
      ),
    },
  ];

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>发布公益品</h1>
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
            addDonor({ name: itemName, status: 0 });
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

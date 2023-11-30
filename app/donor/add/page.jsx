"use client";
import React, { useEffect, useState } from "react";
import { Upload, Button, Input, message, Space, Table, Modal } from "antd";
import Image from "next/image";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { baseUrl } from "@/constant";
import { useRouter } from "next/navigation";

// 请求方法

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

const AddPage = () => {
  const [data, setData] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null)

  const getDonor = async (userId) => {
    const response = await fetch(`/api/donor?creatorId=${userId}`, {
      method: "GET",
    });
    const data = await response.json();
    console.log("back data ", data);
    setData(data.data);
  };

  const addDonor = async (donor) => {
    const response = await fetch("/api/donor", {
      method: "POST",
      body: JSON.stringify(donor),
    });
    await response.json();
    await getDonor(userData.id);
    setItemName("");
    setItemDesc("");
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
      body: JSON.stringify({ id: changeUid, status: 2 }),
    });
  };

  const handleItemNameChange = (e) => {
    setItemName(e.target.value);
  };

  const handleItemDescChange = (e) => {
    setItemDesc(e.target.value);
  };

  useEffect(() => {
    let temp = JSON.parse(sessionStorage.getItem("userData"))
    setUserData(temp)

    getDonor(temp.id);
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
      render: (text, record) => (
        <>
          <Button
            disabled={record.status === 1 ? false : true}
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            发货
          </Button>
          <Modal
            title="发货地址"
            open={isModalOpen}
            onOk={() => {
              handleAddressSelected("", record.id);
              setIsModalOpen(false);
            }}
            onCancel={() => {
              setIsModalOpen(false);
            }}
          >
            <p>上海市 徐汇区 </p>
          </Modal>
        </>

        // <AddressSelectModal
        //   trigger={(address) => {
        //     if (record.status !== 1) {
        //       message.error("该物品未捐赠");
        //       return;
        //     }

        //     handleAddressSelected(address, record.uuid);
        //   }}
        // />
      ),
    },
  ];

  const sendItems = async (record) => {};

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
      // setImageUrl("http://18.143.105.18:3001/upload/" + path);
      setImageUrl("/upload/" + path);
    }
  };

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
        <Input
          value={itemDesc}
          placeholder="请输入描述"
          onChange={handleItemDescChange}
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
            if (itemDesc === "") {
              message.error("请输入物品描述");
              return;
            }
            if (imageUrl === "") {
              message.error("请选择图片");
              return;
            }
            addDonor({
              title: itemName,
              status: 0,
              image: imageUrl || "",
              creatorId: userData.id,
              content: itemDesc,
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
    </div>
  );
};

export default AddPage;

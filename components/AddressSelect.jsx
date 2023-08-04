import { Modal, Button, Cascader } from "antd";
import { useState } from "react";

const options = [
  {
    value: "zhejiang",
    label: "浙江",
    children: [
      {
        value: "hangzhou",
        label: "杭州",
        children: [
          {
            value: "xihu",
            label: "西湖",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "江苏",
    children: [
      {
        value: "nanjing",
        label: "南京",
        children: [
          {
            value: "zhonghuamen",
            label: "中华门",
          },
        ],
      },
    ],
  },
  {
    value: "shanghai",
    label: "上海",
    children: [
      {
        value: "pudong",
        label: "浦东",
      },
    ],
  },
];
const AddressSelectModal = ({ trigger }) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // 模态框的显示状态
  const [selectedAddress, setSelectedAddress] = useState(""); // 选中地址状态变量

  // 更新选中地址
  const handleAddressChange = (value) => {
    setSelectedAddress(value);
  };

  // 打开模态框
  const showModal = () => {
    setIsModalVisible(true);
  };

  // 确认选中地址并关闭模态框
  const handleOk = () => {
    trigger(selectedAddress);
    setIsModalVisible(false);
  };

  // 取消选择并关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        选择地址
      </Button>
      <Modal
        title="请选择地址"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Cascader
          options={options}
          onChange={handleAddressChange}
          placeholder="Please select"
        />
      </Modal>
    </>
  );
};

export default AddressSelectModal;

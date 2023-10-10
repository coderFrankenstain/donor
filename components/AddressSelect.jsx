import { Modal, Button, Cascader } from "antd";
import { useState } from "react";

const options = [
  {
    value: "浙江",
    label: "浙江",
    children: [
      {
        value: "杭州",
        label: "杭州",
        children: [
          {
            value: "西湖",
            label: "西湖",
          },
        ],
      },
    ],
  },
  {
    value: "江苏",
    label: "江苏",
    children: [
      {
        value: "南京",
        label: "南京",
        children: [
          {
            value: "中华门",
            label: "中华门",
          },
        ],
      },
    ],
  },
  {
    "value": "上海",
    "label": "上海",
    "children": [
        {
            "value": "浦东新区",
            "label": "浦东新区"
        },
        {
            "value": "黄浦区",
            "label": "黄浦区"
        },
        {
            "value": "徐汇区",
            "label": "徐汇区"
        },
        {
            "value": "长宁区",
            "label": "长宁区"
        },
        {
            "value": "静安区",
            "label": "静安区"
        },
        {
            "value": "普陀区",
            "label": "普陀区"
        },
        {
            "value": "虹口区",
            "label": "虹口区"
        },
        {
            "value": "杨浦区",
            "label": "杨浦区"
        },
        {
            "value": "闵行区",
            "label": "闵行区"
        },
        {
            "value": "宝山区",
            "label": "宝山区"
        },
        {
            "value": "嘉定区",
            "label": "嘉定区"
        },
        {
            "value": "浦东区",
            "label": "浦东区"
        },
        {
            "value": "金山区",
            "label": "金山区"
        },
        {
            "value": "松江区",
            "label": "松江区"
        },
        {
            "value": "青浦区",
            "label": "青浦区"
        },
        {
            "value": "奉贤区",
            "label": "奉贤区"
        },
        {
            "value": "崇明区",
            "label": "崇明区"
        }
    ]
}
];
const AddressSelectModal = ({ trigger }) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // 模态框的显示状态
  const [selectedAddress, setSelectedAddress] = useState(""); // 选中地址状态变量

  // 更新选中地址
  const handleAddressChange = (value) => {
    setSelectedAddress(value.join(' '));
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
        获取捐赠
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

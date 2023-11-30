"use client";
import React from "react";
import { Layout, Menu, theme } from "antd";
import {
  AppstoreAddOutlined,
  SettingOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
const { Header, Content, Footer, Sider } = Layout;

const siderItems = [
  { key: "add", icon: <AppstoreAddOutlined />, label: "发布公益品" },
  { key: "exchange", icon: <SyncOutlined />, label: "兑换艺术品" },
];

const DonorLayout = ({ children }) => {
  const lastPart = usePathname().split("/").pop();
  console.log("last part ", lastPart);
  // return (
  //   <Layout style={{ width: "100%" }}>
  //     <Sider>
  //       <Menu theme="dark" mode="inline" defaultSelectedKeys={[lastPart]}>
  //         {siderItems.map((value) => (
  //           <Menu.Item key={value.key} icon={value.icon}>
  //             <Link href={`/donor/${value.key.toLowerCase()}`}>
  //               {value.label}
  //             </Link>
  //           </Menu.Item>
  //         ))}
  //       </Menu>
  //     </Sider>
  //     <Layout>
  //       <Content style={{ margin: "24px 16px 0" }}>
  //         <div
  //           style={{
  //             padding: 24,
  //             minHeight: 360,
  //             background: "#ffffff",
  //           }}
  //         >
  //           {children}
  //         </div>
  //       </Content>
  //     </Layout>
  //   </Layout>
  // );
  return <Layout style={{ width: "100%" }}>{children}</Layout>;
};

export default DonorLayout;


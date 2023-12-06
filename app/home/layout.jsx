"use client";
import React from "react";
import { Layout, Menu, theme } from "antd";

const HomePageLayout = ({ children }) => {
    const layoutStyle = {
        width: "100%",
        height: "100%",
        backgroundImage: 'url("/images/homepage.jpg")', // 替换为您的图片URL
        backgroundSize: "auto", // 或者 "contain" 根据您的需要
        backgroundRepeat: "repeat",
        backgroundPosition: "left top",
      };
    return <div style={layoutStyle}>{children}</div>;
  };
  
  export default HomePageLayout;
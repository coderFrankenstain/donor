"use client";
import React from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  const onFinish = async (values) => {
    // 在这里处理登录逻辑
    const response = await fetch("/api/user/login", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const result = await response.json();
    if (result.code == 200) {
      message.success("登录成功");
      console.log("user login data ", result.data);
      localStorage.setItem("userData", JSON.stringify(result.data));
      router.push("/home");
    } else {
      message.error("登录失败");
    }
    console.log("back ", result);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={{ maxWidth: "300px", margin: "auto" }}>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form.Item>

        {/* 假设你有一个转到登录页面的按钮 */}
        <Form.Item>
          <Button
            type="default"
            htmlType="button"
            block
            onClick={() => {
              router.push("/register");
            }}
          >
            去注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;

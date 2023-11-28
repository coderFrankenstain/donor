"use client";
import React from "react";
import { Form, Input, Button, Radio, message, Space } from "antd";

const RegisterPage = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    // 在这里处理登录逻辑
    const response = await fetch("/api/user/register", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const result = await response.json();
    if (result.code == 200) {
      message.success("注册成功");
    } else {
      message.error("注册失败");
    }
  };

  return (
    <Form form={form} name="register" onFinish={onFinish} scrollToFirstError>
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: "请输入你的用户名!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: "请输入你的密码!",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="确认密码"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "请确认你的密码!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("两次输入的密码不匹配!"));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="type"
        label="用户类型"
        rules={[
          {
            required: true,
            message: "请选择用户类型!",
          },
        ]}
      >
        <Radio.Group>
          <Radio value={0}>捐赠者</Radio>
          <Radio value={1}>受助者</Radio>
          <Radio value={2}>数字艺术家</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          注册
        </Button>
      </Form.Item>

      {/* 假设你有一个转到登录页面的按钮 */}
      <Form.Item>
        <Button
          type="default"
          htmlType="button"
          block
          onClick={() => {
            /* 导航到登录页面逻辑 */
          }}
        >
          去 登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterPage;

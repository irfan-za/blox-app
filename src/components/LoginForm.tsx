import "@ant-design/v5-patch-for-react-19";
import React from "react";
import { Form, Input, Checkbox, Button, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { LoginFormValues } from "@/types";

export default function LoginForm() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const onFinish = async (values: LoginFormValues) => {
    try {
      const response = await authApi.login(values);

      if (response.status === 200) {
        messageApi.open({
          type: "success",
          content: "Login successful!",
        });
        router.push("/");
      } else {
        messageApi.open({
          type: "error",
          content: "Login failed. Please check your credentials.",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content:
          error.response?.data?.message || "An error occurred during login.",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        name="login"
        layout="vertical"
        initialValues={{ rememberMe: false }}
        onFinish={onFinish}
        autoComplete="off"
        requiredMark={false}
      >
        <Form.Item
          label={
            <span className="text-sm">
              Email <span className="text-red-500">*</span>
            </span>
          }
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
              type: "email",
            },
          ]}
        >
          <Input
            placeholder="Input your email..."
            size="large"
            className="rounded-md"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-sm">
              Access Token <span className="text-red-500">*</span>
            </span>
          }
          name="accessToken"
          rules={[
            {
              required: true,
              message: "Please input your GoREST access token!",
            },
          ]}
        >
          <Input.Password
            placeholder="Input your Go REST access token..."
            size="large"
            className="rounded-md"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item name="rememberMe" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className=" rounded-md"
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

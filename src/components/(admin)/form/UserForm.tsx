"use client";
import { User } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import SkeletonForm from "./SkeletonForm";
import { fetchUserAction } from "@/server/actions";
import { Form, Input, Select, Button, message } from "antd";
import { useRouter } from "next/navigation";

export default function UserForm({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { data: user } = useQuery<User>({
    queryKey: ["user", id],
    queryFn: async () => {
      if (id === "create-user") {
        return {} as User;
      }
      const user = await fetchUserAction({ id: Number(id), method: "get" });
      return user;
    },
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: async (values: User) => {
      return await fetchUserAction({
        ...(id !== "create-user" && { id: Number(id) }),
        method: id === "create-user" ? "post" : "put",
        data: values,
      });
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: `Successfully ${
          id === "create-user" ? "created" : "updated"
        } user`,
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.replace("/");
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        content:
          error instanceof Error && error.message.includes("422")
            ? "Email already exists, please use a different email."
            : "Failed to save user data. Please try again.",
      });
    },
  });

  if (!user) return <SkeletonForm />;

  return (
    <div className="max-w-2xl p-6">
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        initialValues={user}
        onFinish={(values) => mutation.mutate(values as User)}
        className="space-y-4"
      >
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: "Please input your full name!" }]}
        >
          <Input
            placeholder="Please fill user full name..."
            className="w-full"
          />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Please select gender!" }]}
        >
          <Select placeholder="male">
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Please fill the email..." className="w-full" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select status!" }]}
        >
          <Select placeholder="active">
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={mutation.isPending}
            disabled={mutation.isPending}
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            {id === "create-user" ? "Create" : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

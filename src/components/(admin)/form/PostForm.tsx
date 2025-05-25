"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import SkeletonForm from "./SkeletonForm";
import { fetchPostAction } from "@/server/actions";
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/navigation";
import { Post } from "@/types";
import TextArea from "antd/es/input/TextArea";

export default function PostForm({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { data: post } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: async () => {
      if (id === "create-post") {
        return {} as Post;
      }
      const post = await fetchPostAction({ id: Number(id), method: "get" });
      return post;
    },
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: async (values: Post) => {
      return await fetchPostAction({
        ...(id !== "create-post" && { id: Number(id) }),
        method: id === "create-post" ? "post" : "put",
        data: values,
      });
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: `Successfully ${
          id === "create-post" ? "created" : "updated"
        } post`,
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.replace("/");
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        content: error instanceof Error ? error.message : "Failed to save post",
      });
    },
  });

  if (!post) return <SkeletonForm />;

  return (
    <div className="max-w-2xl p-6">
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        initialValues={post}
        onFinish={(values) => mutation.mutate(values as Post)}
        className="space-y-4"
      >
        <Form.Item
          label="User Id"
          name="user_id"
          rules={[{ required: true, message: "Please input your user id!" }]}
        >
          <Input placeholder="Please fill post user id..." className="w-full" />
        </Form.Item>

        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input your title!" }]}
        >
          <Input placeholder="Please fill the title..." className="w-full" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="body"
          rules={[
            { required: true, message: "Please input your description!" },
          ]}
        >
          <TextArea
            placeholder="Please fill the description..."
            className="w-full"
            rows={4}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={mutation.isPending}
            disabled={mutation.isPending}
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            {id === "create-post" ? "Create" : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

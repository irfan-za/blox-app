"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import SkeletonForm from "./SkeletonForm";
import {
  fetchPostAction,
  fetchUserAction,
  fetchUsersAction,
} from "@/server/actions";
import { Form, Input, Button, message, AutoComplete } from "antd";
import { useRouter } from "next/navigation";
import { Post, PostFormField, User } from "@/types";
import TextArea from "antd/es/input/TextArea";

export default function PostForm({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [userOptions, setUserOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    name: string;
    id: string;
  }>({ name: "", id: "" });

  const { data: post } = useQuery<PostFormField>({
    queryKey: ["post", id],
    queryFn: async () => {
      if (id === "create-post") {
        return {} as PostFormField;
      }
      const post = await fetchPostAction({ id: Number(id), method: "get" });
      const user = await fetchUserAction({
        id: Number(await post.user_id),
        method: "get",
      });
      setSelectedUser({ name: user.name, id: user.id.toString() });
      return {
        ...post,
        name: user.name,
      };
    },
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: async (values: Post) => {
      const newValues = {
        ...values,
        user_id: Number(selectedUser.id),
      };
      return await fetchPostAction({
        ...(id !== "create-post" && { id: Number(id) }),
        method: id === "create-post" ? "post" : "put",
        data: newValues,
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

  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;

    return (searchValue: string) => {
      clearTimeout(timeoutId);

      if (!searchValue) {
        setUserOptions([]);
        return;
      }

      setSearchLoading(true);
      timeoutId = setTimeout(async () => {
        try {
          const users = await fetchUsersAction(1, 10, {
            name: searchValue,
            gender: "",
            status: "",
          });
          const options = users.data.map((user: User) => ({
            value: user.id.toString(),
            label: user.name,
          }));
          setUserOptions(options);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setUserOptions([]);
        } finally {
          setSearchLoading(false);
        }
      }, 400);
    };
  }, []);

  const handleUserSearch = (value: string) => {
    debouncedSearch(value);
  };

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
          label="User Name (Author)"
          name="name"
          rules={[{ required: true, message: "Please select a user!" }]}
        >
          <AutoComplete
            options={userOptions}
            onSearch={handleUserSearch}
            onSelect={(value, option) => {
              form.setFieldsValue({ name: option.label });
              setSelectedUser({ name: option.label, id: value });
            }}
            placeholder="Search and select a user"
            className="w-full"
            showSearch
            filterOption={false}
            value={selectedUser.name || undefined}
            notFoundContent={searchLoading ? "Searching..." : "No users found"}
          />
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

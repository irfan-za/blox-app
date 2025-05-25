import { fetchPostAction, fetchUserAction } from "@/server/actions";
import { SelectedData } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Modal, message } from "antd";
import React, { useState } from "react";

interface DeleteParams {
  queryKey: "users" | "posts";
  id: number;
}

export default function DeleteModal({
  deleteModalVisible,
  selectedData,
  setDeleteModalVisible,
  setSelectedData,
  queryKey,
}: {
  deleteModalVisible: boolean;
  selectedData: SelectedData;
  setDeleteModalVisible: (visible: boolean) => void;
  setSelectedData: (user: SelectedData | null) => void;
  queryKey: "users" | "posts";
}) {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const handleDelete = async ({
    queryKey,
    id,
  }: DeleteParams): Promise<void> => {
    if (!selectedData) return;

    try {
      setLoading(true);
      if (queryKey === "users") {
        const responseStatus = await fetchUserAction({
          id,
          method: "delete",
        });
        if (responseStatus !== 204) {
          throw new Error("Failed to delete user");
        }
      } else if (queryKey === "posts") {
        const responseStatus = await fetchPostAction({
          id,
          method: "delete",
        });
        if (responseStatus !== 204) {
          throw new Error("Failed to delete post");
        }
      }
      messageApi.open({
        type: "success",
        content: `Successfully deleted ${queryKey.slice(0, -1)}`,
      });
      queryClient.invalidateQueries({ queryKey: [`${queryKey}`] });
      setDeleteModalVisible(false);
      setLoading(false);
      setTimeout(() => {
        setSelectedData(null);
      }, 1500);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      setLoading(false);
      messageApi.open({
        type: "error",
        content: `Failed to delete ${queryKey.slice(0, -1)}`,
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={() => handleDelete({ queryKey, id: selectedData?.id })}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
        confirmLoading={loading}
        okButtonProps={{
          danger: true,
          disabled: loading,
        }}
      >
        <p>Are you sure you want to delete user {selectedData?.name}?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </>
  );
}

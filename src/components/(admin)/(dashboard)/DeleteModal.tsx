import { fetchUserAction } from "@/server/actions";
import { SelectedUser } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Modal, message } from "antd";
import React, { useState } from "react";

interface DeleteParams {
  queryKey: "users" | "posts";
  id: number;
}

export default function DeleteModal({
  deleteModalVisible,
  selectedUser,
  setDeleteModalVisible,
  setSelectedUser,
  queryKey,
}: {
  deleteModalVisible: boolean;
  selectedUser: SelectedUser;
  setDeleteModalVisible: (visible: boolean) => void;
  setSelectedUser: (user: SelectedUser | null) => void;
  queryKey: "users" | "posts";
}) {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const handleDelete = async ({
    queryKey,
    id,
  }: DeleteParams): Promise<void> => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      const responseStatus = await fetchUserAction({
        id,
        method: "delete",
      });
      if (responseStatus !== 204) {
        throw new Error("Failed to delete user");
      }
      messageApi.open({
        type: "success",
        content: `Successfully deleted ${selectedUser.name}`,
      });
      queryClient.invalidateQueries({ queryKey: [`${queryKey}`] });
      setDeleteModalVisible(false);
      setLoading(false);
      setTimeout(() => {
        setSelectedUser(null);
      }, 1500);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      setLoading(false);
      messageApi.open({
        type: "error",
        content: "Failed to delete user",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={() => handleDelete({ queryKey, id: selectedUser?.id })}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
        confirmLoading={loading}
        okButtonProps={{ 
          danger: true,
          disabled: loading 
        }}
      >
        <p>Are you sure you want to delete user {selectedUser?.name}?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </>
  );
}

"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, Input, Button, Space, Dropdown, Select } from "antd";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SelectedData } from "@/types";
import DeleteModal from "./DeleteModal";

interface Post {
  id: number;
  user_id: number;
  title: string;
  body: string;
}

interface PostTableProps {
  posts: {
    data: Post[];
    current: number;
    pageSize: number;
    total: number;
  };
  isPostsLoading: boolean;
  postsTableParams: TableParams;
  idFilter: string | null;
  userIdFilter: string | null;
  searchTitle: string;
  setPostsTableParams: (params: TableParams) => void;
  setIdFilter: (value: string | null) => void;
  setUserIdFilter: (value: string | null) => void;
  setSearchTitle: (value: string) => void;
  postsRefetch: () => void;
}

interface TableParams {
  pagination: TablePaginationConfig;
  filters: Record<string, FilterValue | null>;
}

const PostTable: React.FC<PostTableProps> = ({
  posts,
  isPostsLoading,
  postsTableParams,
  idFilter,
  userIdFilter,
  searchTitle,
  setPostsTableParams,
  setIdFilter,
  setUserIdFilter,
  setSearchTitle,
  postsRefetch,
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState<SelectedData | null>(null);
  const [idOptions, setIdOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [userIdOptions, setUserIdOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Post> | SorterResult<Post>[]
  ) => {
    setPostsTableParams({
      pagination: {
        ...pagination,
        total: posts.total,
      },
      filters,
    });

    if (!Array.isArray(sorter) && (!sorter.order || !sorter.column)) {
      setTimeout(() => {
        postsRefetch();
      }, 400);
    }
  };
  const debouncedFilter = useMemo(() => {
    let timeoutId: NodeJS.Timeout;

    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setPostsTableParams({
          ...postsTableParams,
          pagination: {
            ...postsTableParams.pagination,
            current: 1,
          },
        });
        postsRefetch();
      }, 400);
    };
  }, [postsTableParams, postsRefetch]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setSearchTitle(value);
      debouncedFilter();
    },
    [debouncedFilter]
  );
  useEffect(() => {
    if (posts) {
      const uniqueIds = new Set<string>();
      const idOptions = posts.data.reduce(
        (acc: { value: string; label: string }[], post: Post) => {
          const id = post.id.toString();
          if (!uniqueIds.has(id)) {
            uniqueIds.add(id);
            acc.push({
              value: id,
              label: `#${id}`,
            });
          }
          return acc;
        },
        []
      );

      const uniqueUserIds = new Set<string>();
      const userIdOptions = posts.data.reduce(
        (acc: { value: string; label: string }[], post: Post) => {
          const userId = post.user_id.toString();
          if (!uniqueUserIds.has(userId)) {
            uniqueUserIds.add(userId);
            acc.push({
              value: userId,
              label: userId,
            });
          }
          return acc;
        },
        []
      );

      setIdOptions(idOptions);
      setUserIdOptions(userIdOptions);
    }
  }, [posts]);

  const columns: ColumnsType<Post> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a.id - b.id,
      render: (id) => <span>#{id}</span>,
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
      width: "10%",
      sorter: (a, b) => a.user_id - b.user_id,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "20%",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (title) => (
        <div className="truncate max-w-64" title={title}>
          {title}
        </div>
      ),
    },
    {
      title: "Content",
      dataIndex: "body",
      key: "body",
      width: "40%",
      sorter: (a, b) => a.body.localeCompare(b.body),
      render: (body) => (
        <div className="truncate max-w-80" title={body}>
          {body}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: "edit", label: "Edit" },
              { key: "delete", label: "Delete", danger: true },
            ],
            onClick: ({ key }) => handleAction(key, record),
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const handleAction = (action: string, post: Post) => {
    switch (action) {
      case "edit":
        queryClient.setQueryData(["post", post.id.toString()], post);
        router.push(`/posts/${post.id}`);
        break;
      case "delete":
        setSelectedData({ name: post.title, id: post.id });
        setDeleteModalVisible(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="bg-background rounded-lg p-3 md:p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-4">
            <Select
              placeholder="ID"
              value={idFilter}
              onChange={(value) => {
                setIdFilter(value);
                debouncedFilter();
              }}
              allowClear
              className="w-28 md:w-32"
              options={idOptions}
            />
            <Select
              placeholder="User ID"
              value={userIdFilter}
              onChange={(value) => {
                setUserIdFilter(value);
                debouncedFilter();
              }}
              allowClear
              className="w-28 md:w-32"
              options={userIdOptions}
            />
          </div>
          <Space>
            <Input
              placeholder="Search title"
              value={searchTitle}
              onChange={handleSearch}
              suffix={<SearchOutlined />}
              className="w-60 md:w-80"
            />
          </Space>
        </div>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={posts.data}
            rowKey="id"
            loading={isPostsLoading}
            pagination={{
              current: posts.current,
              pageSize: posts.pageSize,
              total: posts.total,
              showSizeChanger: true,
              showTotal: (total, range) => {
                return `${range[0]}-${range[1]} of ${total} items`;
              },
            }}
            onChange={handleTableChange}
          />
        </div>
      </div>
      {selectedData && (
        <DeleteModal
          deleteModalVisible={deleteModalVisible}
          selectedData={selectedData}
          setDeleteModalVisible={setDeleteModalVisible}
          setSelectedData={setSelectedData}
          queryKey="posts"
        />
      )}
    </>
  );
};

export default PostTable;

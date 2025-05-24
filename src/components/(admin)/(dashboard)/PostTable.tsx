"use client";
import React, { useState } from "react";
import { Table, Input, Button, Space, Dropdown } from "antd";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue } from "antd/es/table/interface";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Post {
  id: number;
  user_id: number;
  title: string;
  body: string;
}

interface PostTableProps {
  initialData?: Post[];
  initialTotal?: number;
}

interface TableParams {
  pagination: TablePaginationConfig;
  filters: Record<string, FilterValue | null>;
}

const PostTable: React.FC<PostTableProps> = ({
  initialData = [],
  initialTotal = 0,
}) => {
  const [searchText, setSearchText] = useState("");
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      total: initialTotal,
    },
    filters: {},
  });

  const fetchPosts = async () => {
    const params = new URLSearchParams();

    // Add pagination
    params.append("page", String(tableParams.pagination.current));
    params.append("per_page", String(tableParams.pagination.pageSize));

    // Add filters
    if (searchText) params.append("title", searchText);

    const response = await axios.get("https://gorest.co.in/public/v2/posts", {
      params,
      headers: {
        // Add your API token if needed
        // Authorization: 'Bearer YOUR_TOKEN'
      },
    });

    // GoRest API returns total count in header
    const total =
      Number(response.headers["x-pagination-total"]) || response.data.length;

    return {
      data: response.data,
      total,
    };
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["posts", tableParams, searchText],
    queryFn: fetchPosts,
    initialData: { data: initialData, total: initialTotal },
  });

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>
  ) => {
    setTableParams({
      pagination: {
        ...pagination,
        total: data?.total,
      },
      filters,
    });
  };

  const handleSearch = () => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
    refetch();
  };

  const handleReset = () => {
    setSearchText("");
    setTableParams({
      pagination: {
        current: 1,
        pageSize: 10,
      },
      filters: {},
    });
    refetch();
  };

  const columns: ColumnsType<Post> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
      render: (id) => <span>#{id}</span>,
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
      width: "10%",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "30%",
      render: (title) => (
        <div className="truncate max-w-xs" title={title}>
          {title}
        </div>
      ),
    },
    {
      title: "Content",
      dataIndex: "body",
      key: "body",
      width: "40%",
      render: (body) => (
        <div className="truncate max-w-md" title={body}>
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
              { key: "view", label: "View" },
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
      case "view":
        console.log("Viewing post:", post);
        break;
      case "edit":
        console.log("Editing post:", post);
        break;
      case "delete":
        console.log("Deleting post:", post);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap gap-4 justify-between">
        <Button onClick={handleReset}>Reset</Button>
        <Space>
          <Input
            placeholder="Search title"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            suffix={
              <SearchOutlined
                onClick={handleSearch}
                className="cursor-pointer"
              />
            }
            style={{ width: 200 }}
          />
          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="id"
        loading={isLoading}
        pagination={{
          ...tableParams.pagination,
          showSizeChanger: true,
          showTotal: (total) =>
            `1-${tableParams.pagination.pageSize} of ${total} items`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default PostTable;

"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, Input, Button, Space, Dropdown, Select } from "antd";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { SelectedData } from "@/types";
import { fetchPostAction, fetchPostsAction } from "@/server/actions";
import DeleteModal from "./DeleteModal";

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
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page")
    ? parseInt(searchParams.get("page") || "1")
    : 1;
  const currentPerPage = searchParams.get("per_page")
    ? parseInt(searchParams.get("per_page") || "10")
    : 10;
  const [idFilter, setIdFilter] = useState<string | null>(
    searchParams.get("id") || null
  );
  const [userIdFilter, setUserIdFilter] = useState<string | null>(
    searchParams.get("user_id") || null
  );
  const [searchText, setSearchText] = useState<string>(
    searchParams.get("title") || ""
  );
  const [idOptions, setIdOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [userIdOptions, setUserIdOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: currentPage,
      pageSize: currentPerPage,
      total: initialTotal,
    },
    filters: {},
  });
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState<SelectedData | null>(null);

  const fetchPosts = async () => {
    const params = new URLSearchParams();
    const page = tableParams.pagination.current || 1;
    const per_page = tableParams.pagination.pageSize || 10;

    const paramValues = {
      page: String(page),
      per_page: String(per_page),
      title: searchText,
      user_id: userIdFilter,
      id: idFilter,
    };

    Object.entries(paramValues).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    let posts;
    if (idFilter) {
      const singlePost = await fetchPostAction({
        id: Number(idFilter),
        method: "get",
      });
      posts = {
        data: singlePost ? [singlePost] : [],
        total: singlePost ? 1 : 0,
      };
    } else {
      posts = await fetchPostsAction(page, per_page, {
        title: searchText,
        user_id: userIdFilter ?? "",
      });
    }

    window.history.replaceState(
      {},
      "",
      params.toString() ? `?${params.toString()}` : window.location.pathname
    );

    return {
      data: posts.data,
      current: page,
      pageSize: per_page,
      total: posts.total,
    };
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["posts", tableParams, searchText],
    queryFn: fetchPosts,
    initialData: {
      data: initialData,
      current: currentPage,
      pageSize: currentPerPage,
      total: initialTotal,
    },
  });

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Post> | SorterResult<Post>[]
  ) => {
    setTableParams({
      pagination: {
        ...pagination,
        total: data?.total,
      },
      filters,
    });

    if (!Array.isArray(sorter) && (!sorter.order || !sorter.column)) {
      setTimeout(() => {
        refetch();
      }, 400);
    }
  };
  const debouncedFilter = useMemo(() => {
    let timeoutId: NodeJS.Timeout;

    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            current: 1,
          },
        });
        refetch();
      }, 400);
    };
  }, [tableParams, refetch]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setSearchText(value);
      debouncedFilter();
    },
    [debouncedFilter]
  );
  useEffect(() => {
    if (data) {
      const uniqueIds = new Set<string>();
      const idOptions = data.data.reduce(
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
      const userIdOptions = data.data.reduce(
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
  }, [data]);

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
              value={searchText}
              onChange={handleSearch}
              suffix={<SearchOutlined />}
              className="w-60 md:w-80"
            />
          </Space>
        </div>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={data?.data}
            rowKey="id"
            loading={isLoading}
            pagination={{
              current: data.current,
              pageSize: data.pageSize,
              total: data?.total,
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

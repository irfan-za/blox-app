"use client";
import React, { useState, useMemo, useCallback } from "react";
import { Table, Input, Select, Button, Space, Dropdown } from "antd";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue } from "antd/es/table/interface";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SelectedUser, User } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchUsersAction } from "@/server/actions";
import { cn } from "@/lib/utils";
import DeleteModal from "./DeleteModal";

interface UserTableProps {
  initialData?: User[];
  initialTotal?: number;
}

interface TableParams {
  pagination: TablePaginationConfig;
  filters: Record<string, FilterValue | null>;
}

const UserTable: React.FC<UserTableProps> = ({
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
  const [genderFilter, setGenderFilter] = useState<string | null>(
    searchParams.get("gender") || null
  );
  const [statusFilter, setStatusFilter] = useState<string | null>(
    searchParams.get("status") || null
  );
  const [searchText, setSearchText] = useState<string>(
    searchParams.get("name") || ""
  );
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: currentPage,
      pageSize: currentPerPage,
      total: initialTotal,
    },
    filters: {},
  });
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

  const fetchUsers = async () => {
    const params = new URLSearchParams();
    const page = tableParams.pagination.current || 1;
    const per_page = tableParams.pagination.pageSize || 10;

    const paramValues = {
      page: String(page),
      per_page: String(per_page),
      gender: genderFilter ?? "",
      status: statusFilter ?? "",
      name: searchText,
    };

    Object.entries(paramValues).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    const users = await fetchUsersAction(page, per_page, {
      gender: genderFilter ?? "",
      status: statusFilter ?? "",
      name: searchText,
    });

    window.history.replaceState(
      {},
      "",
      params.toString() ? `?${params.toString()}` : window.location.pathname
    );

    return {
      data: users.data,
      current: page,
      pageSize: per_page,
      total: users.total,
    };
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", tableParams, genderFilter, statusFilter, searchText],
    queryFn: fetchUsers,
    initialData: {
      data: initialData,
      current: currentPage,
      pageSize: currentPerPage,
      total: initialTotal,
    },
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

    setTimeout(() => {
      refetch();
    }, 400);
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

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a.id - b.id,
      render: (id) => <span>#{id}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "30%",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: "15%",
      sorter: (a, b) => a.gender.localeCompare(b.gender),
      render: (gender) => <span className="capitalize">{gender}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => (
        <span
          className={cn(
            "text-sm px-2 py-0.5 rounded-full",
            status === "active"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          )}
        >
          {status}
        </span>
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

  const handleAction = (action: string, user: User) => {
    switch (action) {
      case "edit":
        queryClient.setQueryData(["user", user.id.toString()], user);
        router.push(`/users/${user.id}`);
        break;
      case "delete":
        setSelectedUser({ name: user.name, id: user.id });
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
              placeholder="Gender"
              value={genderFilter}
              onChange={(value) => {
                setGenderFilter(value);
                debouncedFilter();
              }}
              allowClear
              className="w-28 md:w-32"
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
            />
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                debouncedFilter();
              }}
              allowClear
              className="w-28 md:w-32"
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
          </div>
          <Space>
            <Input
              placeholder="Search name"
              value={searchText}
              onChange={handleSearch}
              suffix={<SearchOutlined />}
              className="w-60 md:w-80"
            />
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={data?.data}
          rowKey="id"
          loading={isLoading}
          className="bg-background overflow-x-auto"
          pagination={{
            current: data.current,
            pageSize: data.pageSize,
            total: data?.total,
            showSizeChanger: true,
            showTotal: (total) =>
              `1-${tableParams.pagination.pageSize} of ${total} items`,
          }}
          onChange={handleTableChange}
        />
      </div>
      {selectedUser && (
        <DeleteModal
          deleteModalVisible={deleteModalVisible}
          selectedUser={selectedUser}
          setDeleteModalVisible={setDeleteModalVisible}
          setSelectedUser={setSelectedUser}
          queryKey="users"
        />
      )}
    </>
  );
};

export default UserTable;

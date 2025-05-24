"use client";
import React, { useState, useMemo, useCallback } from "react";
import { Table, Input, Select, Button, Space, Dropdown } from "antd";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue } from "antd/es/table/interface";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import { useSearchParams } from "next/navigation";
import { fetchUsersAction } from "@/server/actions";

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

  const fetchUsers = async () => {
    const params = new URLSearchParams(searchParams.toString());
    const page = tableParams.pagination.current || 1;
    const per_page = tableParams.pagination.pageSize || 10;

    params.set("page", String(page));
    params.set("per_page", String(per_page));
    if (genderFilter) params.set("gender", genderFilter);
    if (statusFilter) params.set("status", statusFilter);
    if (searchText) params.set("name", searchText);

    const users = await fetchUsersAction(page, per_page, {
      gender: genderFilter ?? "",
      status: statusFilter ?? "",
      name: searchText,
    });

    window.history.replaceState({}, "", `?${params.toString()}`);

    return {
      data: users.data,
      total: users.total,
    };
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", tableParams, genderFilter, statusFilter, searchText],
    queryFn: fetchUsers,
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
      render: (id) => <span>#{id}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "30%",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: "15%",
      render: (gender) => <span className="capitalize">{gender}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => <span className="capitalize text-sm">{status}</span>,
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

  const handleAction = (action: string, user: User) => {
    switch (action) {
      case "view":
        console.log("Viewing user:", user);
        break;
      case "edit":
        console.log("Editing user:", user);
        break;
      case "delete":
        console.log("Deleting user:", user);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-background rounded-lg p-3 md:p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap gap-4 justify-between">
        <div className="flex flex-wrap gap-4">
          <Select
            placeholder="Gender"
            value={genderFilter}
            onChange={(value) => {
              setGenderFilter(value);
              debouncedFilter();
            }}
            allowClear
            style={{ width: 120 }}
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
            style={{ width: 120 }}
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
            style={{ width: 200 }}
          />
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="id"
        loading={isLoading}
        className=" bg-background"
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

export default UserTable;

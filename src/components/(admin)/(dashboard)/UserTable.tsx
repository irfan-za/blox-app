"use client";
import React, { useState } from "react";
import { Table, Input, Select, Button, Space, Dropdown } from "antd";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue } from "antd/es/table/interface";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User } from "@/types";

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
  const [searchText, setSearchText] = useState("");
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      total: initialTotal,
    },
    filters: {},
  });

  const [genderFilter, setGenderFilter] = useState<string | undefined>(
    undefined
  );
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );

  const fetchUsers = async () => {
    const params = new URLSearchParams();

    // Add pagination
    params.append("page", String(tableParams.pagination.current));
    params.append("per_page", String(tableParams.pagination.pageSize));

    // Add filters
    if (genderFilter) params.append("gender", genderFilter);
    if (statusFilter) params.append("status", statusFilter);
    if (searchText) params.append("name", searchText);

    const response = await axios.get("https://gorest.co.in/public/v2/users", {
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
    setGenderFilter(undefined);
    setStatusFilter(undefined);
    setTableParams({
      pagination: {
        current: 1,
        pageSize: 10,
      },
      filters: {},
    });
    refetch();
  };

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
      render: (status) => (
        <span
          className={`capitalize px-2 py-1 rounded-md text-sm ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
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
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap gap-4 justify-between">
        <div className="flex flex-wrap gap-4">
          <Select
            placeholder="Gender"
            value={genderFilter}
            onChange={setGenderFilter}
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
            onChange={setStatusFilter}
            allowClear
            style={{ width: 120 }}
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
          <Button onClick={handleReset}>Reset</Button>
        </div>
        <Space>
          <Input
            placeholder="Search name"
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

export default UserTable;

"use client";
import React, { useState, useMemo, useCallback } from "react";
import { Table, Input, Select, Button, Space, Dropdown } from "antd";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import { useQueryClient } from "@tanstack/react-query";
import { SelectedData, TableParams, User } from "@/types";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import DeleteModal from "./DeleteModal";

interface UserTableProps {
  users: {
    data: User[];
    current: number;
    pageSize: number;
    total: number;
  };
  isUsersLoading: boolean;
  usersTableParams: TableParams;
  genderFilter: string | null;
  statusFilter: string | null;
  searchName: string;
  setUsersTableParams: (params: TableParams) => void;
  setGenderFilter: (value: string | null) => void;
  setStatusFilter: (value: string | null) => void;
  setSearchName: (value: string) => void;
  usersRefetch: () => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  isUsersLoading,
  usersTableParams,
  genderFilter,
  statusFilter,
  searchName,
  setUsersTableParams,
  setGenderFilter,
  setStatusFilter,
  setSearchName,
  usersRefetch,
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState<SelectedData | null>(null);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<User> | SorterResult<User>[]
  ) => {
    setUsersTableParams({
      pagination: {
        ...pagination,
        total: users.total,
      },
      filters,
    });

    if (!Array.isArray(sorter) && (!sorter.order || !sorter.column)) {
      setTimeout(() => {
        usersRefetch();
      }, 400);
    }
  };

  const debouncedFilter = useMemo(() => {
    let timeoutId: NodeJS.Timeout;

    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setUsersTableParams({
          ...usersTableParams,
          pagination: {
            ...usersTableParams.pagination,
            current: 1,
          },
        });
        usersRefetch();
      }, 400);
    };
  }, [usersTableParams, usersRefetch]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setSearchName(value);
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
        setSelectedData({ name: user.name, id: user.id });
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
              value={searchName}
              onChange={handleSearch}
              suffix={<SearchOutlined />}
              className="w-60 md:w-80"
            />
          </Space>
        </div>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={users?.data}
            rowKey="id"
            loading={isUsersLoading}
            pagination={{
              current: users.current,
              pageSize: users.pageSize,
              total: users?.total,
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
          queryKey="users"
        />
      )}
    </>
  );
};

export default UserTable;

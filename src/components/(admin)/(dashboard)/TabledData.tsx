import React from "react";
import { Tabs } from "antd";
import UserTable from "./UserTable";
import { Post, TableParams, User } from "@/types";
import PostTable from "./PostTable";

interface TabledDataProps {
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

const TabledData: React.FC<TabledDataProps> = ({
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
  return (
    <div className="rounded-lg shadow-sm">
      <Tabs
        defaultActiveKey="users"
        items={[
          {
            key: "users",
            label: "Users",
            children: (
              <UserTable
                users={users}
                isUsersLoading={isUsersLoading}
                usersTableParams={usersTableParams}
                genderFilter={genderFilter}
                statusFilter={statusFilter}
                searchName={searchName}
                setUsersTableParams={setUsersTableParams}
                setGenderFilter={setGenderFilter}
                setStatusFilter={setStatusFilter}
                setSearchName={setSearchName}
                usersRefetch={usersRefetch}
              />
            ),
          },
          {
            key: "posts",
            label: "Posts",
            children: (
              <PostTable
                posts={posts}
                isPostsLoading={isPostsLoading}
                postsTableParams={postsTableParams}
                idFilter={idFilter}
                userIdFilter={userIdFilter}
                searchTitle={searchTitle}
                setPostsTableParams={setPostsTableParams}
                setIdFilter={setIdFilter}
                setUserIdFilter={setUserIdFilter}
                setSearchTitle={setSearchTitle}
                postsRefetch={postsRefetch}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default TabledData;

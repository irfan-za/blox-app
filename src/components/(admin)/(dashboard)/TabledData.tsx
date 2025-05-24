import React from "react";
import { Tabs } from "antd";
import UserTable from "./UserTable";
import PostTable from "./PostTable";
import { Post, User } from "@/types";

interface TabledDataProps {
  initialUsers?: User[];
  initialTotalUsers?: number;
  initialPosts?: Post[];
  initialTotalPosts?: number;
}

const TabledData: React.FC<TabledDataProps> = ({
  initialUsers = [],
  initialTotalUsers = 0,
  initialPosts = [],
  initialTotalPosts = 0,
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
                initialData={initialUsers}
                initialTotal={initialTotalUsers}
              />
            ),
          },
          {
            key: "posts",
            label: "Posts",
            children: (
              <PostTable
                initialData={initialPosts}
                initialTotal={initialTotalPosts}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default TabledData;

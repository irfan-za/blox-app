"use client";
import "@ant-design/v5-patch-for-react-19";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Button, Dropdown, Space } from "antd";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { User } from "@/types";

export default function AdminNavbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Button
          danger
          type="primary"
          className="w-full"
          onClick={() => handleLogout()}
        >
          Logout
        </Button>
      ),
    },
  ];

  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    await authApi.logout();
    router.push("/login");
  };
  useEffect(() => {
    const getUser = async () => {
      const data = await authApi.me();
      setUser(data);
    };
    getUser();
  }, []);

  return (
    <nav className="border-b border-2 border-gray-300 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button onClick={onMenuClick} className="p-2 md:hidden">
          <MenuOutlined className="text-xl" />
        </button>
        <Image src="/images/blox-icon.png" alt="Logo" width={32} height={32} />
        <div className="flex flex-col ml-4">
          <h1 className="font-bold text-xl">BloX App</h1>
          <p className="text-gray-700 text-xs">part of Great Applications</p>
        </div>
      </div>
      {user ? (
        <Dropdown menu={{ items }} className="rounded-md">
          <Button className="h-fit p-1 rounded-md">
            <Space>
              <div className="flex items-center space-x-2">
                <Image
                  src="/images/user-profile.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium text-start">{user.name}</p>
                  <p className="text-xs text-gray-700 text-start">
                    {user.email}
                  </p>
                </div>
              </div>
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      ) : (
        <div className="animate-pulse">
          <div className="flex items-center space-x-2 w-24 md:w-36">
            <div className="w-8 h-8 rounded-full bg-gray-300" />
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded" />
              <div className="h-3 bg-gray-300 rounded mt-1" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

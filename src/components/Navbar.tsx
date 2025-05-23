"use client";
import "@ant-design/v5-patch-for-react-19";

import Image from "next/image";
import React from "react";
import type { MenuProps } from "antd";
import { Button, Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export default function Navbar() {
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
  const router = useRouter();

  const handleLogout = async () => {
    await authApi.logout();
    router.push("/login");
  };
  return (
    <nav className="border-b border-2 border-gray-300 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Image src="/images/blox-icon.png" alt="Logo" width={32} height={32} />
        <div className="flex flex-col ml-4">
          <h1 className="font-bold text-xl">BloX App</h1>
          <p className="text-gray-700 text-xs">part of Great Applications</p>
        </div>
      </div>
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
                <p className="font-medium text-start">Budiii rakhamadio</p>
                <p className="text-xs text-gray-700 text-start">
                  irfan@gmail.com
                </p>
              </div>
            </div>
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </nav>
  );
}

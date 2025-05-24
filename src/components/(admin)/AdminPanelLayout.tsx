"use client";
import { Layout, Menu } from "antd";
import {
  LayoutOutlined,
  UserOutlined,
  FormOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Navbar from "./Navbar";
import { cn } from "@/lib/utils";
const { Sider, Content } = Layout;
export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleMenuClick = () => {
    setMobileOpen(!mobileOpen);
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onMenuClick={handleMenuClick} />
      <Layout className="min-h-screen">
        <Sider
          theme="light"
          collapsed={collapsed}
          collapsible
          trigger={null}
          className={`
          transition-all duration-300
          fixed md:relative
          h-full
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute right-[-12px] top-6 hidden md:flex items-center justify-center h-6 w-6 bg-white rounded-full border"
          >
            {collapsed ? <RightOutlined /> : <LeftOutlined />}
          </button>

          <div className="mx-4 my-6">
            <div className="mb-6">
              <h3
                className={cn("font-semibold", {
                  hidden: collapsed,
                })}
              >
                Dashboard
              </h3>
              <Menu
                mode="vertical"
                selectedKeys={[pathname === "/" ? "dashboard" : ""]}
                items={[
                  {
                    key: "dashboard",
                    icon: <LayoutOutlined />,
                    label: <Link href="/">Dashboard</Link>,
                  },
                ]}
              />
            </div>

            <div>
              <h3
                className={cn("font-semibold", {
                  hidden: collapsed,
                })}
              >
                Blog Management
              </h3>
              <Menu
                mode="vertical"
                selectedKeys={[pathname.replace("/", "")]}
                items={[
                  {
                    key: "create-user",
                    icon: <UserOutlined />,
                    label: <Link href="/create-user">Create User</Link>,
                  },
                  {
                    key: "create-post",
                    icon: <FormOutlined />,
                    label: <Link href="/create-post">Create Post</Link>,
                  },
                ]}
              />
            </div>
          </div>
        </Sider>

        <Content className="p-6 md:ml-0 transition-all duration-300">
          {children}
        </Content>
      </Layout>
    </div>
  );
}

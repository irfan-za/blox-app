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
import AdminNavbar from "./AdminNavbar";
import { cn } from "@/lib/utils";
import AdminHeader from "./AdminHeader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const { Sider, Content } = Layout;
export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(true);
  const pathname = usePathname();

  const handleMenuClick = () => {
    setCollapsed(mobileOpen ? true : !collapsed);
    setMobileOpen(!mobileOpen);
  };
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 5 * 60 * 1000,
      },
    },
  });

  const MenuLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => {
    return (
      <Link
        href={href}
        onClick={() => {
          setTimeout(() => setMobileOpen(false), 500);
        }}
      >
        {children}
      </Link>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-svh">
        <AdminNavbar
          onMenuClick={handleMenuClick}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
        <Layout>
          <Sider
            theme="light"
            collapsed={collapsed}
            collapsible
            trigger={null}
            className={`
          transition-all duration-300
          fixed md:relative
          h-full z-10
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
                      label: <MenuLink href="/">Dashboard</MenuLink>,
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
                  selectedKeys={[
                    pathname.startsWith("/posts")
                      ? "create-post"
                      : pathname.startsWith("/users")
                      ? "create-user"
                      : "",
                  ]}
                  items={[
                    {
                      key: "create-user",
                      icon: <UserOutlined />,
                      label: (
                        <MenuLink href="/users/create-user">
                          Create User
                        </MenuLink>
                      ),
                    },
                    {
                      key: "create-post",
                      icon: <FormOutlined />,
                      label: (
                        <MenuLink href="/posts/create-post">
                          Create Post
                        </MenuLink>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </Sider>

          <Content className="p-6 md:ml-0 transition-all duration-300 overflow-y-auto">
            <AdminHeader />

            {children}
          </Content>
        </Layout>
      </div>
    </QueryClientProvider>
  );
}

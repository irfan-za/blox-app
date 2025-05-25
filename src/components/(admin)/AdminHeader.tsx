"use client";
import { LayoutOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <span className="text-primary text-sm">
        <LayoutOutlined className="mr-1" />
        <Link href={"/"}>Dashboard</Link>
        <Link href={pathname} className="text-foreground">
          {pathname !== "/" && pathname}
        </Link>
      </span>
      <div className="border-b border-border my-4"></div>
    </div>
  );
}

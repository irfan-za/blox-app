"use client";
import { LayoutOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";
import React from "react";

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-primary text-sm">
        <LayoutOutlined className="mr-1" />
        <span>Dashboard</span>
        <span className="text-foreground">{pathname}</span>
      </p>
      <div className="border-b border-border my-4"></div>
    </div>
  );
}

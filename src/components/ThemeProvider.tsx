"use client";

import React from "react";
import { ConfigProvider } from "antd";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#59a2a6",
          borderRadius: 2,
          colorBgContainer: "#f1f3f0",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;

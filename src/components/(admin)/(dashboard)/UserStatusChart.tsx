"use client";
import React from "react";
import { Card } from "antd";
import ReactECharts from "echarts-for-react";

interface UserStatusChartProps {
  totalActiveUser: number;
  totalNonActiveUser: number;
  totalUsers: number;
}
const UserStatusChart = ({
  totalActiveUser,
  totalNonActiveUser,
  totalUsers,
}: UserStatusChartProps) => {
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      bottom: "10%",
      right: "10%",
      orient: "vertical",
      itemWidth: 10,
      itemHeight: 10,
      formatter: (name: string) => {
        return `${name}`;
      },
    },
    series: [
      {
        name: "Active Users",
        type: "pie",
        radius: ["55%", "70%"],
        center: ["30%", "50%"],

        labelLine: {
          show: false,
        },
        label: {
          show: false,
        },
        data: [
          {
            value: totalActiveUser,
            name: "Active",
            itemStyle: { color: "#5AD8A6" },
          },
          {
            value: totalNonActiveUser,
            name: "Non Active",
            itemStyle: { color: "#E8E8E8" },
          },
        ],
      },
      {
        name: "Non Active Users",
        type: "pie",
        radius: ["30%", "45%"],
        center: ["30%", "50%"],
        labelLine: {
          show: false,
        },
        label: {
          show: false,
        },
        data: [
          {
            value: totalNonActiveUser,
            name: "Non Active",
            itemStyle: { color: "#36A2EB" },
          },
          {
            value: totalActiveUser,
            name: "Active",
            itemStyle: { color: "#E8E8E8" },
          },
        ],
      },
      {
        type: "gauge",
        radius: "30%",
        center: ["80%", "50%"],
        zlevel: 1,
        detail: {
          formatter: `${totalActiveUser}/${totalUsers}`,
          offsetCenter: [0, 0],
          fontSize: 16,
          fontWeight: "bold",
          color: "#6b7280",
        },
        data: [{ value: 0 }],
        title: { show: false },
        pointer: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
      },
    ],
  };

  return (
    <Card
      className="shadow-sm h-fit border rounded-lg border-border"
      size="small"
      title="User Status"
    >
      <div className="h-48 ">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </Card>
  );
};

export default UserStatusChart;

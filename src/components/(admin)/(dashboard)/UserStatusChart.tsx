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
    series: [
      {
        name: "Non Active Users",
        type: "pie",
        radius: ["30%", "45%"],
        center: ["50%", "50%"],
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
            name: "Active Users",
            itemStyle: { color: "#E8E8E8" },
          },
        ],
      },
      {
        name: "Active Users",
        type: "pie",
        radius: ["55%", "70%"],
        center: ["50%", "50%"],

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
    ],
  };

  return (
    <Card
      className="shadow-sm h-fit border rounded-lg border-border"
      size="small"
      title="User Status"
    >
      <div className="flex h-48 justify-between ">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
        <div className=" flex flex-1 w-full justify-center flex-col">
          <p className="text-muted-foreground text-xl font-bold mb-4">
            <span className="text-foreground">{totalActiveUser}</span>/
            {totalUsers}
          </p>
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-[#5AD8A6] mr-1"></div>
            <span className="text-xs text-nowrap">Active</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#36A2EB] mr-1"></div>
            <span className="text-xs text-nowrap">Non Active</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserStatusChart;

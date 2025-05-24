"use client";
import React from "react";
import { Card } from "antd";
import ReactECharts from "echarts-for-react";

interface UserStatusChartProps {
  totalMaleUsers: number;
  totalFemaleUsers: number;
  totalUsers: number;
}
const GenderDistributionChart = ({
  totalMaleUsers,
  totalFemaleUsers,
  totalUsers,
}: UserStatusChartProps) => {
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      bottom: "0",
      left: "center",
      itemWidth: 10,
      itemHeight: 10,
      formatter: (name: string) => {
        return name === "Male"
          ? `(${totalMaleUsers}) Male`
          : `(${totalFemaleUsers}) Female`;
      },
    },
    series: [
      {
        name: "Gender Distribution",
        type: "pie",
        radius: ["45%", "70%"],
        center: ["50%", "50%"],
        labelLine: {
          show: false,
        },
        label: {
          show: true,
          position: "center",
          formatter: () => {
            return "Total\n" + totalUsers;
          },
          fontSize: "14",
          fontWeight: "bold",
        },
        data: [
          {
            value: totalMaleUsers,
            name: "Male",
            itemStyle: { color: "#7951a9" },
          },
          {
            value: totalFemaleUsers,
            name: "Female",
            itemStyle: { color: "#4682b4" },
          },
        ],
      },
    ],
  };

  return (
    <Card
      className="shadow-sm h-fit border rounded-lg border-border"
      size="small"
      title="Post Distribution by Gender"
    >
      <div className="h-[250px]">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </Card>
  );
};

export default GenderDistributionChart;

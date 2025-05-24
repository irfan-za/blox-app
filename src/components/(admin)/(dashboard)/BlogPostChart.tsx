"use client";
import React from "react";
import { Card } from "antd";
import ReactECharts from "echarts-for-react";

const BlogPostChart = () => {
  const userData = [
    { name: "NuHk", value: 55 },
    { name: "Madona", value: 65 },
    { name: "John", value: 75 },
    { name: "Doe", value: 78 },
    { name: "Catty", value: 82 },
    { name: "Johnson", value: 88 },
    { name: "Gary", value: 93 },
    { name: "Jerry", value: 102 },
    { name: "XiJuan", value: 103 },
  ];

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: userData.map((item) => item.name),
      axisLabel: {
        interval: 0,
        rotate: 0,
      },
    },
    yAxis: {
      type: "value",
      max: 120,
      axisLine: {
        show: false,
      },
    },
    series: [
      {
        name: "Total Post",
        type: "bar",
        data: userData.map((item) => item.value),
        itemStyle: {
          color: "#5AD8A6",
        },
      },
    ],
  };

  return (
    <Card className="shadow-sm" title="Blog Post Quantity">
      <div className="h-[350px]">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
      <div className="text-center text-xs mt-2 text-gray-500">User Name</div>
    </Card>
  );
};

export default BlogPostChart;

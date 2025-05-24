"use client";
import React from "react";
import { Card } from "antd";
import ReactECharts from "echarts-for-react";

interface UserPost {
  id: string;
  name: string;
  value: number;
}

const BlogPostChart = ({ userPosts }: { userPosts: UserPost[] }) => {
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
      data: userPosts.map((item) => item.name),
      axisLabel: {
        interval: 0,
        rotate: 0,
      },
    },
    yAxis: {
      type: "value",
      max: 5,
      axisLine: {
        show: false,
      },
    },
    series: [
      {
        name: "Total Post",
        type: "bar",
        data: userPosts.map((item) => item.value),
        itemStyle: {
          color: "#5AD8A6",
        },
      },
    ],
  };

  return (
    <Card
      className="shadow-sm rounded-lg border border-border"
      title="Blog Post Quantity"
    >
      <div className="h-[28rem]">
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

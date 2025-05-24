"use client";
import React from "react";
import { Card } from "antd";
import ReactECharts from "echarts-for-react";

const UserStatusChart = () => {
  const option = {
    series: [
      {
        type: "gauge",
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 1,
            color: "#5AD8A6",
          },
        },
        axisLine: {
          lineStyle: {
            width: 18,
            color: [[1, "#E3E3E3"]],
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        title: {
          show: false,
        },
        detail: {
          width: 50,
          height: 14,
          fontSize: 28,
          color: "#000",
          formatter: "95/120",
          valueAnimation: true,
          offsetCenter: [0, 0],
        },
        data: [
          {
            value: 79.17,
          },
        ],
      },
    ],
  };

  return (
    <Card className="shadow-sm" title="User Status">
      <div className="h-[250px]">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
      <div className="flex justify-center mt-2">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-[#5AD8A6] mr-1"></div>
          <span className="text-xs">Active</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#36A2EB] mr-1"></div>
          <span className="text-xs">Non Active</span>
        </div>
      </div>
    </Card>
  );
};

export default UserStatusChart;

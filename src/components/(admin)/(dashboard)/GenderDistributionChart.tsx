"use client";
import React from "react";
import { Card } from "antd";
import ReactECharts from "echarts-for-react";

const GenderDistributionChart = () => {
  const option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "0",
      left: "center",
      itemWidth: 10,
      itemHeight: 10,
      formatter: (name: string) => {
        return name === "Male" ? "(25) Male" : "(25) Female";
      },
    },
    series: [
      {
        name: "Gender Distribution",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 0,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
          formatter: () => {
            return "Total\n120";
          },
          fontSize: "14",
          fontWeight: "bold",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "16",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 50, name: "Male", itemStyle: { color: "#554BF1" } },
          { value: 50, name: "Female", itemStyle: { color: "#F178B6" } },
        ],
      },
    ],
  };

  return (
    <Card className="shadow-sm" title="Post Distribution by Gender">
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

import React from "react";
import { Skeleton, Card } from "antd";

export default function SkeletonForm() {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 shadow-sm">
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton.Input active size="large" className="w-32 mx-auto" />
          <Skeleton.Input active size="large" block className="w-full" />
          <Skeleton.Input active size="large" block className="w-full" />
          <Skeleton.Input active size="large" block className="w-full" />
          <Skeleton.Input active size="large" block className="w-full" />
          <Skeleton.Input active size="large" block className="w-full" />
        </div>

        <div className="pt-4">
          <Skeleton.Button
            active
            size="large"
            className="w-full"
            shape="round"
          />
        </div>
      </div>
    </Card>
  );
}

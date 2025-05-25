import React from "react";
import { Skeleton, Card } from "antd";

export default function SkeletonForm() {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 shadow-sm">
      <div className="space-y-8">
        {/* Form Title */}
        <div className="mb-6">
          <Skeleton.Input active size="large" block className="h-8 !w-48" />
        </div>

        {/* Full Name Field */}
        <div className="space-y-2">
          <Skeleton.Input active size="small" className="!w-24" />
          <Skeleton.Input active size="large" block className="!w-full" />
        </div>

        {/* Gender Field */}
        <div className="space-y-2">
          <Skeleton.Input active size="small" className="!w-24" />
          <Skeleton.Input active size="large" className="!w-32" />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Skeleton.Input active size="small" className="!w-24" />
          <Skeleton.Input active size="large" block className="!w-full" />
        </div>

        {/* Status Field */}
        <div className="space-y-2">
          <Skeleton.Input active size="small" className="!w-24" />
          <Skeleton.Input active size="large" className="!w-32" />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Skeleton.Button
            active
            size="large"
            className="!w-full"
            shape="round"
          />
        </div>
      </div>
    </Card>
  );
}

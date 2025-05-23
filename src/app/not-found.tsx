"use client";
import "@ant-design/v5-patch-for-react-19";

import { Button, Result, Typography, Space } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Title, Paragraph } = Typography;

export default function NotFound() {
  return (
    <Result
      status="404"
      title={
        <Title level={1} className="text-2xl md:text-3xl lg:text-4xl mb-6">
          Page Not Found
        </Title>
      }
      subTitle={
        <Paragraph className="text-base md:text-lg text-gray-600">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </Paragraph>
      }
      extra={
        <Space direction="horizontal" size="middle" wrap className="mt-2">
          <Link href="/" passHref>
            <Button type="primary" size="large" icon={<HomeOutlined />}>
              Back to Home
            </Button>
          </Link>
        </Space>
      }
    />
  );
}

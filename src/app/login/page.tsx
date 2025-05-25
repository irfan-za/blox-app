"use client";
import React from "react";
import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex flex-col w-full md:w-1/2 justify-center items-center px-8 pt-10 md:pt-16 md:px-16">
        <div className="w-full max-w-xl">
          <div className="mb-10 flex items-center">
            <div className="flex-shrink-0 mr-2">
              <Image
                src="/images/blox-icon.png"
                alt="BloX App"
                width={40}
                height={40}
              />
            </div>
            <h1 className="text-2xl font-bold">BloX App</h1>
          </div>
          <h2 className="text-3xl font-bold mb-6">Login</h2>
          <LoginForm />
        </div>

        <div className="mt-auto pb-4 text-center text-gray-500 text-xs">
          <p>Copyright © 2025 BloX App</p>
          <p>All Rights Reserved</p>
          <p className="mt-2">App version 1.0.0</p>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 bg-gray-300 relative">
        <Image
          src="/images/blox-illustration.png"
          alt="BloX App Illustration"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}

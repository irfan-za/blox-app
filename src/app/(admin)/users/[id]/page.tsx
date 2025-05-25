import UserForm from "@/components/(admin)/form/UserForm";
import { notFound } from "next/navigation";
import React from "react";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  if (id !== "create-user" && isNaN(Number(id))) {
    notFound();
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">
        {id === "create-user" ? "Create User" : "Edit User"}
      </h1>
      <UserForm id={id} />
    </div>
  );
}

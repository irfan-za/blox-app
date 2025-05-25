"use client";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import SkeletonForm from "./SkeletonForm";
import { fetchUserAction } from "@/server/actions";

export default function UserForm({ id }: { id: string }) {
  const { data: user } = useQuery<User>({
    queryKey: ["user", id],
    queryFn: async () => {
      if (id === "create-user") {
        return {} as User;
      }
      const user = await fetchUserAction({ id: Number(id), method: "get" });
      return user;
    },
    staleTime: Infinity,
  });

  if (!user) return <SkeletonForm />;

  return (
    <div>
      <h1>User Details</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

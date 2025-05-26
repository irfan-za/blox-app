"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { postsApi, usersApi } from "@/lib/api";
import { Post, User } from "@/types";

export const createGoRestApiClient = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("ACCESS_TOKEN")?.value;

  return axios.create({
    baseURL: process.env.API_URL,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  });
};

export async function fetchUsersAction(
  page: number,
  per_page: number,
  query: {
    gender: string;
    status: string;
    name: string;
  }
) {
  return await usersApi.getUsers({
    page: page || 1,
    per_page: per_page || 10,
    query: {
      gender: query.gender,
      status: query.status,
      name: query.name,
    },
  });
}
export async function fetchUserAction({
  id,
  method,
  data,
}: {
  id?: number;
  method: "get" | "post" | "put" | "delete";
  data?: User;
}) {
  const response =
    method === "get" && id
      ? await usersApi.getUser(id)
      : method === "delete" && id
      ? await usersApi.deleteUser(id)
      : method === "post" && data
      ? await usersApi.createUser(data)
      : method === "put" && id && data
      ? await usersApi.updateUser(id, data)
      : null;
  if (!response) {
    throw new Error("Invalid method or parameters");
  }
  return response.data;
}

export async function fetchPostsAction(
  page: number,
  per_page: number,
  query: {
    title: string;
    user_id: string;
  }
) {
  return await postsApi.getPosts({
    page: page || 1,
    per_page: per_page || 10,
    query: {
      title: query.title,
      user_id: query.user_id,
    },
  });
}

export async function fetchPostAction({
  id,
  method,
  data,
}: {
  id?: number;
  method: "get" | "post" | "put" | "delete";
  data?: Post;
}) {
  const response =
    method === "get" && id
      ? await postsApi.getPost(id)
      : method === "delete" && id
      ? await postsApi.deletePost(id)
      : method === "post" && data
      ? await postsApi.createPost(data)
      : method === "put" && id && data
      ? await postsApi.updatePost(id, data)
      : null;
  if (!response) {
    throw new Error("Invalid method or parameters");
  }
  return response.data;
}

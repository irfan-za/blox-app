"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { usersApi } from "@/lib/api";

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
export async function fetchUserAction(id: number) {
  const response = await usersApi.getUser(id);
  return response.data;
}

"use server";

import axios from "axios";
import { cookies } from "next/headers";

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

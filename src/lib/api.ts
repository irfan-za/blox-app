import { LoginFormValues, User } from "@/types";
import axios from "axios";
import { createGoRestApiClient } from "@/server/actions";
import { NextResponse } from "next/server";

export const internalApiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const goRestApiClient = async () => {
  return await createGoRestApiClient();
};

export const authApi = {
  login: async (credentials: LoginFormValues) => {
    const response = await internalApiClient.post("/auth/login", credentials);
    return response;
  },

  logout: async () => {
    const response = await internalApiClient.get("/auth/logout");
    return response.data;
  },
  me: async () => {
    const response = await internalApiClient.get("/auth/me");
    return response.data;
  },
};

export const postsApi = {
  getPosts: async ({
    page = 1,
    per_page = 10,
    query = {},
  }: {
    page?: number;
    per_page?: number;
    query?: Record<string, string | string[]>;
  } = {}) => {
    const client = await goRestApiClient();
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      ...query,
    });
    const response = await client.get(`/posts?${params.toString()}`);
    return {
      data: response.data,
      total: parseInt(response.headers["x-pagination-total"] || "0"),
    };
  },

  getPost: async (id: number) => {
    const client = await goRestApiClient();
    const response = await client.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (post: {
    title: string;
    body: string;
    user_id: number;
  }) => {
    const client = await goRestApiClient();
    const response = await client.post("/posts", post);
    return response.data;
  },

  updatePost: async (
    id: number,
    post: { title: string; body: string; user_id: number }
  ) => {
    const client = await goRestApiClient();
    const response = await client.put(`/posts/${id}`, post);
    return response.data;
  },

  deletePost: async (id: number) => {
    const client = await goRestApiClient();
    const response = await client.delete(`/posts/${id}`);
    return response.data;
  },
};

export const usersApi = {
  getUsers: async ({
    page = 1,
    per_page = 10,
    query = {},
  }: {
    page?: number;
    per_page?: number;
    query?: Record<string, string | string[]>;
  } = {}) => {
    const client = await goRestApiClient();
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      ...query,
    });
    const response = await client.get(`/users?${params.toString()}`);
    return {
      data: response.data,
      total: parseInt(response.headers["x-pagination-total"] || "0"),
    };
  },
  getUserPosts: async (userId: number) => {
    const client = await goRestApiClient();
    const response = await client.get(`/users/${userId}/posts`);
    return {
      data: response.data,
      total: parseInt(response.headers["x-pagination-total"] || "0"),
    };
  },
  getUser: async (userId: number) => {
    const client = await goRestApiClient();
    const response = await client.get(`/users/${userId}`);
    return {
      data: response.data,
    };
  },
  createUser: async (data: User) => {
    const client = await goRestApiClient();
    const response = await client.post(`/users`, data);
    return { data: response.data };
  },
  updateUser: async (userId: number, data: User) => {
    const client = await goRestApiClient();
    const response = await client
      .put(`/users/${userId}`, data)
      .catch((error) => {
        if (error.response?.status === 404) {
          return NextResponse.json("User not found", {
            status: 404,
            statusText: "User not found",
          });
        }
        return NextResponse.json("Failed to update user", {
          status: 500,
          statusText: "Failed to update user",
        });
      });
    return { data: response.status };
  },
  deleteUser: async (userId: number) => {
    const client = await goRestApiClient();
    const response = await client.delete(`/users/${userId}`).catch((error) => {
      if (error.response?.status === 404) {
        return NextResponse.json("User not found", {
          status: 404,
          statusText: "User not found",
        });
      }
      return NextResponse.json("Failed to delete user", {
        status: 500,
        statusText: "Failed to delete user",
      });
    });
    return { data: response?.status };
  },
};

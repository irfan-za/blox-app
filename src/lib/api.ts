import { LoginFormValues } from "@/types";
import axios from "axios";

export const internalApiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const goRestApiClient = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${accessToken}`,
  },
});

export const authApi = {
  login: async (credentials: LoginFormValues) => {
    const response = await internalApiClient.post("/auth/login", credentials);
    return response;
  },

  logout: async () => {
    const response = await internalApiClient.post("/auth/logout");
    return response.data;
  },
};

export const postsApi = {
  getPosts: async (page: number = 1, per_page: number = 10) => {
    const response = await goRestApiClient.get(
      `/posts?page=${page}&per_page=${per_page}`
    );
    return response.data;
  },

  getPost: async (id: number) => {
    const response = await goRestApiClient.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (post: {
    title: string;
    body: string;
    user_id: number;
  }) => {
    const response = await goRestApiClient.post("/posts", post);
    return response.data;
  },

  updatePost: async (
    id: number,
    post: { title: string; body: string; user_id: number }
  ) => {
    const response = await goRestApiClient.put(`/posts/${id}`, post);
    return response.data;
  },

  deletePost: async (id: number) => {
    const response = await goRestApiClient.delete(`/posts/${id}`);
    return response.data;
  },
};

export const usersApi = {
  getUsers: async (page: number = 1, per_page: number = 10) => {
    const response = await goRestApiClient.get(
      `/users?page=${page}&per_page=${per_page}`
    );
    return response.data;
  },
  postUsers: async (email: string) => {
    const response = await goRestApiClient.post(`/users`, {
      email,
    });
    return response.data;
  },
};

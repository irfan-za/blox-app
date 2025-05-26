import { TablePaginationConfig } from "antd";
import { FilterValue } from "antd/es/table/interface";

export type LoginFormValues = {
  email: string;
  accessToken: string;
  rememberMe?: boolean;
};
export type User = {
  id: number;
  name: string;
  email: string;
  gender: "male" | "female";
  status: "active" | "inactive";
};
export type Post = {
  id: number;
  user_id: number;
  title: string;
  body: string;
};
export interface UserPost {
  id: number;
  name: string;
  value: number;
}
export type PostFormField = {
  id: number;
  user_id: number;
  name: string;
  body: string;
};
export type SelectedData = {
  id: number;
  name: string;
};
export interface TableParams {
  pagination: TablePaginationConfig;
  filters: Record<string, FilterValue | null>;
}

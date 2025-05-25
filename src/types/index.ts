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
export type SelectedData = {
  id: number;
  name: string;
};

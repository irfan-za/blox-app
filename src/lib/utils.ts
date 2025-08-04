import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const validateUser = (email: string, accessToken: string) => {
  return (
    email === process.env.NEXT_PUBLIC_EMAIL &&
    accessToken === process.env.NEXT_PUBLIC_ACCESS_TOKEN
  );
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

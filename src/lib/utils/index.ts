import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const validateUser = (email: string, accessToken: string) => {
  return (
    email === process.env.EMAIL && accessToken === process.env.ACCESS_TOKEN
  );
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

"use client";

import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    await authApi.logout();
    router.push("/login");
  };

  return (
    <main>
      Dashboard page
      <button onClick={handleLogout}>Logout</button>
    </main>
  );
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete("ACCESS_TOKEN");
  return NextResponse.json(
    { success: true, message: "Logout successful" },
    { status: 200 }
  );
}

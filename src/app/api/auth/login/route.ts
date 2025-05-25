import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { validateUser } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { email, accessToken, rememberMe } = await req.json();
    const isValid = validateUser(email, accessToken);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const cookieExpiry = rememberMe
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 24 * 60 * 60 * 1000);

    const cookieStore = await cookies();
    cookieStore.set("ACCESS_TOKEN", accessToken, {
      expires: cookieExpiry,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}

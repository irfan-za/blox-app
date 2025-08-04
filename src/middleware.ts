import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("NEXT_PUBLIC_ACCESS_TOKEN")?.value;
  const pathname = request.nextUrl.pathname;
  const users = await axios
    .get(`${process.env.API_URL}/users/${process.env.USER_ID}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .catch(function (error) {
      if (error.response && !pathname.startsWith("/login")) {
        NextResponse.redirect(new URL("/login", request.url));
        return;
      }
    });
  if (!users?.data && !pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (pathname.startsWith("/login") && users?.data) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/", "/users/:path*", "/posts/:path*"],
};

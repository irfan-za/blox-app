import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("ACCESS_TOKEN")?.value;
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/login")) {
    const users = await axios
      .get(`${process.env.API_URL}/users/7910391`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          NextResponse.redirect(new URL("/login", request.url));
          return;
        }
      });
    if (!users?.data) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/", "/create-user", "/create-post"],
};

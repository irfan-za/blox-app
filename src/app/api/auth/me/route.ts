import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("ACCESS_TOKEN")?.value;
  const users = await axios
    .get(`${process.env.API_URL}/users/7910391`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .catch(function (error) {
      NextResponse.json(
        {
          error: error.response.data,
        },
        { status: error.response.status }
      );
      return;
    });
  if (!users?.data) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }
  return NextResponse.json(users?.data, { status: 200 });
}

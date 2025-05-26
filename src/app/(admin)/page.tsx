import { postsApi, usersApi } from "@/lib/api";
import DashboardClient from "@/components/(admin)/(dashboard)/DashboardClient";
import { User } from "@/types";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { page, per_page, gender, status, name, title } = await searchParams;

  const currentPage = page ? Number(page) : 1;
  const currentPerPage = per_page ? Number(per_page) : 10;
  const genderFilter = typeof gender === "string" ? gender : "";
  const statusFilter = typeof status === "string" ? status : "";
  const nameFilter = typeof name === "string" ? name : "";
  const titleFilter = typeof title === "string" ? title : "";

  const initialUsersData = await usersApi.getUsers({
    page: currentPage,
    per_page: currentPerPage,
    query: {
      gender: genderFilter,
      status: statusFilter,
      name: nameFilter,
    },
  });

  const initialPostsData = await postsApi.getPosts({
    page: currentPage,
    per_page: currentPerPage,
    query: {
      title: titleFilter,
    },
  });
  const initialUserPosts = await Promise.all(
    initialUsersData.data.map(async (user: User) => {
      const { total } = await usersApi.getUserPosts(user.id);
      return {
        id: user.id,
        name: user.name.split(" ")[0],
        value: total,
      };
    })
  );

  return (
    <DashboardClient
      initialUsersData={initialUsersData}
      initialPostsData={initialPostsData}
      initialUserPosts={initialUserPosts}
    />
  );
}

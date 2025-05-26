import StatisticCard from "@/components/(admin)/(dashboard)/StatisticCard";
import BlogPostChart from "@/components/(admin)/(dashboard)/BlogPostChart";
import UserStatusChart from "@/components/(admin)/(dashboard)/UserStatusChart";
import GenderDistributionChart from "@/components/(admin)/(dashboard)/GenderDistributionChart";
import TabledData from "@/components/(admin)/(dashboard)/TabledData";
import { postsApi, usersApi } from "@/lib/api";
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

  const totalUsers = initialUsersData.data.length;
  const totalPosts = initialPostsData.data.length;
  const totalActiveUsers = initialUsersData.data.filter(
    (user: User) => user.status === "active"
  ).length;
  const totalMaleUsers = initialUsersData.data.filter(
    (user: User) => user.gender === "male"
  ).length;

  const userPosts = await Promise.all(
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
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-medium mb-4">Statistic</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatisticCard title="Total User" value={totalUsers.toString()} />
          <StatisticCard title="Total Post" value={totalPosts.toString()} />
          <StatisticCard
            title="User Status (active/non)"
            value={`${totalActiveUsers}/${totalUsers - totalActiveUsers}`}
          />
          <StatisticCard
            title="User Gender (m/f)"
            value={`${totalMaleUsers}/${totalUsers - totalMaleUsers}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 ">
          <BlogPostChart userPosts={userPosts} />
        </div>
        <div className="lg:col-span-1 gap-4 grid grid-row-2">
          <UserStatusChart
            totalActiveUser={totalActiveUsers}
            totalNonActiveUser={totalUsers - totalActiveUsers}
            totalUsers={totalUsers}
          />
          <GenderDistributionChart
            totalMaleUsers={totalMaleUsers}
            totalFemaleUsers={totalUsers - totalMaleUsers}
            totalUsers={totalUsers}
          />
        </div>
      </div>

      <div className="mb-4">
        <TabledData
          initialUsers={initialUsersData.data}
          initialTotalUsers={initialUsersData.total}
          initialPosts={initialPostsData.data}
          initialTotalPosts={initialPostsData.total}
        />
      </div>
    </div>
  );
}

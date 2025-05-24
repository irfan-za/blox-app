import StatisticCard from "@/components/(admin)/(dashboard)/StatisticCard";
import BlogPostChart from "@/components/(admin)/(dashboard)/BlogPostChart";
import UserStatusChart from "@/components/(admin)/(dashboard)/UserStatusChart";
import GenderDistributionChart from "@/components/(admin)/(dashboard)/GenderDistributionChart";
import { postsApi, usersApi } from "@/lib/api";

export default async function DashboardPage() {
  const users = await usersApi.getUsers({});
  const activeUsers = await usersApi.getUsers({ query: { status: "active" } });
  const totalUsers = users.total;
  const totalActiveUsers = activeUsers.total;
  const maleUsers = await usersApi.getUsers({ query: { gender: "male" } });
  const totalMaleUsers = maleUsers.total;
  const totalPosts = await postsApi.getTotalPosts();

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-medium mb-4">Statistic</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatisticCard title="Total User" value={users.total.toString()} />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BlogPostChart />
        </div>
        <div className="lg:col-span-1 grid grid-rows-2 gap-4">
          <UserStatusChart />
          <GenderDistributionChart />
        </div>
      </div>
    </div>
  );
}

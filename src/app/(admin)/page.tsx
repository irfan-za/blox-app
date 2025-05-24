import StatisticCard from "@/components/(admin)/(dashboard)/StatisticCard";
import BlogPostChart from "@/components/(admin)/(dashboard)/BlogPostChart";
import UserStatusChart from "@/components/(admin)/(dashboard)/UserStatusChart";
import GenderDistributionChart from "@/components/(admin)/(dashboard)/GenderDistributionChart";

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-medium mb-4">Statistic</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatisticCard title="Total User" value="120" />
          <StatisticCard title="Total Post" value="72" />
          <StatisticCard title="User Status (active/non)" value="12/21" />
          <StatisticCard title="User Gender (m/f)" value="12/32" />
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

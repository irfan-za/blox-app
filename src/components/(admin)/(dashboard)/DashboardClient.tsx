"use client";
import StatisticCard from "@/components/(admin)/(dashboard)/StatisticCard";
import BlogPostChart from "@/components/(admin)/(dashboard)/BlogPostChart";
import UserStatusChart from "@/components/(admin)/(dashboard)/UserStatusChart";
import GenderDistributionChart from "@/components/(admin)/(dashboard)/GenderDistributionChart";
import TabledData from "@/components/(admin)/(dashboard)/TabledData";
import { Post, User, UserPost } from "@/types";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  fetchPostsAction,
  fetchUserPostsAction,
  fetchUsersAction,
} from "@/server/actions";

export default function DashboardClient({
  initialUsersData,
  initialPostsData,
  initialUserPosts,
}: {
  initialUsersData: { data: User[]; total: number };
  initialPostsData: { data: Post[]; total: number };
  initialUserPosts: UserPost[];
}) {
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<User[]>(initialUsersData.data);
  const [totalUsers, setTotalUsers] = useState(initialUsersData.total);
  const [posts, setPosts] = useState<Post[]>(initialPostsData.data);
  const [totalPosts, setTotalPosts] = useState(initialPostsData.total);
  const [userPosts, setUserPosts] = useState<UserPost[]>(initialUserPosts);

  const [activeUsers, setActiveUsers] = useState(
    initialUsersData.data.filter((user: User) => user.status === "active")
      .length
  );
  const [maleUsers, setMaleUsers] = useState(
    initialUsersData.data.filter((user: User) => user.gender === "male").length
  );

  const [triggerRefetch, setTriggerRefetch] = useState(false);

  useEffect(() => {
    const params = {
      page: Number(searchParams.get("page")) || 1,
      perPage: Number(searchParams.get("per_page")) || 10,
      gender: searchParams.get("gender") || "",
      status: searchParams.get("status") || "",
      name: searchParams.get("name") || "",
      title: searchParams.get("title") || "",
    };

    const fetchData = async () => {
      try {
        const usersData = await fetchUsersAction(params.page, params.perPage, {
          gender: params.gender,
          status: params.status,
          name: params.name,
        });

        setUsers(usersData.data);
        setTotalUsers(usersData.total);
        setActiveUsers(
          usersData.data.filter((user: User) => user.status === "active").length
        );
        setMaleUsers(
          usersData.data.filter((user: User) => user.gender === "male").length
        );

        const postsData = await fetchPostsAction(params.page, params.perPage, {
          title: params.title,
        });

        setPosts(postsData.data);
        setTotalPosts(postsData.total);

        const newUserPosts = await Promise.all(
          usersData.data.map(async (user: User) => {
            const { total } = await fetchUserPostsAction(user.id);
            return {
              id: user.id,
              name: user.name.split(" ")[0],
              value: total,
            };
          })
        );

        setUserPosts(newUserPosts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [triggerRefetch]);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-medium mb-4">Statistic</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatisticCard title="Total User" value={users.length.toString()} />
          <StatisticCard title="Total Post" value={posts.length.toString()} />
          <StatisticCard
            title="User Status (active/non)"
            value={`${activeUsers}/${users.length - activeUsers}`}
          />
          <StatisticCard
            title="User Gender (m/f)"
            value={`${maleUsers}/${users.length - maleUsers}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 ">
          <BlogPostChart userPosts={userPosts} />
        </div>
        <div className="lg:col-span-1 gap-4 grid grid-row-2">
          <UserStatusChart
            totalActiveUser={activeUsers}
            totalNonActiveUser={users.length - activeUsers}
            totalUsers={users.length}
          />
          <GenderDistributionChart
            totalMaleUsers={maleUsers}
            totalFemaleUsers={users.length - maleUsers}
            totalUsers={users.length}
          />
        </div>
      </div>

      <div className="mb-4">
        <TabledData
          initialUsers={users}
          initialTotalUsers={totalUsers}
          initialPosts={posts}
          initialTotalPosts={totalPosts}
          triggerRefetch={triggerRefetch}
          setTriggerRefetch={setTriggerRefetch}
        />
      </div>
    </div>
  );
}

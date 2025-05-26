"use client";
import StatisticCard from "@/components/(admin)/(dashboard)/StatisticCard";
import BlogPostChart from "@/components/(admin)/(dashboard)/BlogPostChart";
import UserStatusChart from "@/components/(admin)/(dashboard)/UserStatusChart";
import GenderDistributionChart from "@/components/(admin)/(dashboard)/GenderDistributionChart";
import TabledData from "@/components/(admin)/(dashboard)/TabledData";
import { Post, TableParams, User, UserPost } from "@/types";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  fetchPostAction,
  fetchPostsAction,
  fetchUserPostsAction,
  fetchUsersAction,
} from "@/server/actions";
import { useQuery } from "@tanstack/react-query";
export default function DashboardClient({
  initialUsersData,
  initialPostsData,
  initialUserPosts,
}: {
  initialUsersData: { data: User[]; total: number };
  initialPostsData: { data: Post[]; total: number };
  initialUserPosts: UserPost[];
}) {
  const [userPosts, setUserPosts] = useState<UserPost[]>(initialUserPosts);
  const [activeUsers, setActiveUsers] = useState(
    initialUsersData.data.filter((user: User) => user.status === "active")
      .length
  );
  const [maleUsers, setMaleUsers] = useState(
    initialUsersData.data.filter((user: User) => user.gender === "male").length
  );

  // USERS table data
  const searchParams = useSearchParams();
  const [genderFilter, setGenderFilter] = useState<string | null>(
    searchParams.get("gender") || null
  );
  const [statusFilter, setStatusFilter] = useState<string | null>(
    searchParams.get("status") || null
  );
  const [searchName, setSearchName] = useState<string>(
    searchParams.get("name") || ""
  );

  const currentPage = searchParams.get("page")
    ? parseInt(searchParams.get("page") || "1")
    : 1;
  const currentPerPage = searchParams.get("per_page")
    ? parseInt(searchParams.get("per_page") || "10")
    : 10;
  const [usersTableParams, setUsersTableParams] = useState<TableParams>({
    pagination: {
      current: currentPage,
      pageSize: currentPerPage,
      total: initialUsersData.total,
    },
    filters: {},
  });

  const fetchUsers = async () => {
    const params = new URLSearchParams();
    const page = usersTableParams.pagination.current || 1;
    const per_page = usersTableParams.pagination.pageSize || 10;

    const paramValues = {
      page: String(page),
      per_page: String(per_page),
      gender: genderFilter ?? "",
      status: statusFilter ?? "",
      name: searchName,
    };

    Object.entries(paramValues).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    const users = await fetchUsersAction(page, per_page, {
      gender: genderFilter ?? "",
      status: statusFilter ?? "",
      name: searchName,
    });
    setActiveUsers(
      users.data.filter((user: User) => user.status === "active").length
    );
    setMaleUsers(
      users.data.filter((user: User) => user.gender === "male").length
    );
    const userPosts = await Promise.all(
      users.data.map(async (user: User) => {
        const { total } = await fetchUserPostsAction(user.id);
        return {
          id: user.id,
          name: user.name.split(" ")[0],
          value: total,
        };
      })
    );
    setUserPosts(userPosts);

    window.history.replaceState(
      {},
      "",
      params.toString() ? `?${params.toString()}` : window.location.pathname
    );

    return {
      data: users.data,
      current: page,
      pageSize: per_page,
      total: users.total,
    };
  };

  const {
    data: users,
    isLoading: isUsersLoading,
    refetch: usersRefetch,
  } = useQuery({
    queryKey: [
      "users",
      usersTableParams,
      genderFilter,
      statusFilter,
      searchName,
    ],
    queryFn: fetchUsers,
    initialData: {
      data: initialUsersData.data,
      current: currentPage,
      pageSize: currentPerPage,
      total: initialUsersData.total,
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  // POSTS table data
  const [idFilter, setIdFilter] = useState<string | null>(
    searchParams.get("id") || null
  );
  const [userIdFilter, setUserIdFilter] = useState<string | null>(
    searchParams.get("user_id") || null
  );
  const [searchTitle, setSearchTitle] = useState<string>(
    searchParams.get("title") || ""
  );

  const [postsTableParams, setPostsTableParams] = useState<TableParams>({
    pagination: {
      current: currentPage,
      pageSize: currentPerPage,
      total: initialPostsData.total,
    },
    filters: {},
  });
  const fetchPosts = async () => {
    const params = new URLSearchParams();
    const page = postsTableParams.pagination.current || 1;
    const per_page = postsTableParams.pagination.pageSize || 10;

    const paramValues = {
      page: String(page),
      per_page: String(per_page),
      title: searchTitle,
      user_id: userIdFilter,
      id: idFilter,
    };

    Object.entries(paramValues).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    let posts;
    if (idFilter) {
      const singlePost = await fetchPostAction({
        id: Number(idFilter),
        method: "get",
      });
      posts = {
        data: singlePost ? [singlePost] : [],
        total: singlePost ? 1 : 0,
      };
    } else {
      posts = await fetchPostsAction(page, per_page, {
        title: searchTitle,
        user_id: userIdFilter ?? "",
      });
    }

    window.history.replaceState(
      {},
      "",
      params.toString() ? `?${params.toString()}` : window.location.pathname
    );

    return {
      data: posts.data,
      current: page,
      pageSize: per_page,
      total: posts.total,
    };
  };

  const {
    data: posts,
    isLoading: isPostsLoading,
    refetch: postsRefetch,
  } = useQuery({
    queryKey: ["posts", postsTableParams, searchTitle],
    queryFn: fetchPosts,
    initialData: {
      data: initialPostsData.data,
      current: currentPage,
      pageSize: currentPerPage,
      total: initialPostsData.total,
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-medium mb-4">Statistic</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatisticCard
            title="Total User"
            value={users.data.length.toString()}
          />
          <StatisticCard
            title="Total Post"
            value={posts.data.length.toString()}
          />
          <StatisticCard
            title="User Status (active/non)"
            value={`${activeUsers}/${users.data.length - activeUsers}`}
          />
          <StatisticCard
            title="User Gender (m/f)"
            value={`${maleUsers}/${users.data.length - maleUsers}`}
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
            totalNonActiveUser={users.data.length - activeUsers}
            totalUsers={users.data.length}
          />
          <GenderDistributionChart
            totalMaleUsers={maleUsers}
            totalFemaleUsers={users.data.length - maleUsers}
            totalUsers={users.data.length}
          />
        </div>
      </div>

      <div className="mb-4">
        <TabledData
          users={users}
          isUsersLoading={isUsersLoading}
          usersTableParams={usersTableParams}
          genderFilter={genderFilter}
          statusFilter={statusFilter}
          searchName={searchName}
          setUsersTableParams={setUsersTableParams}
          setGenderFilter={setGenderFilter}
          setStatusFilter={setStatusFilter}
          setSearchName={setSearchName}
          usersRefetch={usersRefetch}
          posts={posts}
          isPostsLoading={isPostsLoading}
          postsTableParams={postsTableParams}
          idFilter={idFilter}
          userIdFilter={userIdFilter}
          searchTitle={searchTitle}
          setPostsTableParams={setPostsTableParams}
          setIdFilter={setIdFilter}
          setUserIdFilter={setUserIdFilter}
          setSearchTitle={setSearchTitle}
          postsRefetch={postsRefetch}
        />
      </div>
    </div>
  );
}

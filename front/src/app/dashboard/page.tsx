"use client";

import { useEffect, useState } from "react"

import api from "../../utils/api";
import { Task } from "../../lib/type";
import { useRouter } from "next/navigation";
import { User } from "../../lib/type";


import TasksList from "../components/layout/TaskList";
import ProgressCircle from "../components/layout/ProgressCircle";


export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const tokenHeaders = {
        "access-token": localStorage.getItem("access-token"),
        client: localStorage.getItem("client"),
        uid: localStorage.getItem("uid"),
      };

      try {
        const response = await api.get("/auth/validate_token", { headers: tokenHeaders });
        setUser(response.data.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        router.push("/signin"); // 認証失敗時にサインインページへリダイレクト
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);


  if (loading) return <p>Loading...</p>;



  const tasks : Task[] = [
    {
      title: "Task 1",
      description: "text content",
      createdBy: "Mick",
      deadline: "2024.12.31",
      progressRate: 73,
    },
    {
      title: "Task 2",
      description: "text content",
      createdBy: "John",
      deadline: "2024.12.31",
      progressRate: 60,
    },
    {
      title: "Task 3",
      description: "text content",
      createdBy: "Jack",
      deadline: "2024.12.31",
      progressRate: 0,
    },
  ];

  return (
    <div>
      <h1>Welcome to your Dashboard, {user?.name}!</h1>
      <div className="flex bg-primary text-white min-h-screen p-6 space-x-8">
      <TasksList tasks={tasks} />
      <ProgressCircle completedTasks={17} totalTasks={30} />
    </div>
    </div>
  );
}

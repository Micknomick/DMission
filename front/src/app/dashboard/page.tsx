"use client";

import { useEffect, useState } from "react"

import api from "../../utils/api";
import { Task } from "../../lib/type";
import { useRouter } from "next/navigation";
import { User } from "../../lib/type";


import TasksList from "../components/layout/TaskListSmall";
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



  const tasks: Task[] = [
    {
      id: 1,
      title: "Task 1",
      description: "text content",
      missionId: 1,
      createdByUserId: 1,
      assignedUserId: 2,
      teamId: 1,
      progressRate: 73,
      status: "in_progress",
      createdBy: "Mick",
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: "2024-01-05T15:00:00Z",
      deadline: "2024-12-31",
    },
    {
      id: 2,
      title: "Task 2",
      description: "text content",
      missionId: 1,
      createdByUserId: 2,
      assignedUserId: 3,
      teamId: 1,
      progressRate: 60,
      status: "in_progress",
      createdBy: "John",
      createdAt: "2024-01-02T11:00:00Z",
      updatedAt: "2024-01-06T16:00:00Z",
      deadline: "2024-12-31",
    },
    {
      id: 3,
      title: "Task 3",
      description: "text content",
      missionId: 2,
      createdByUserId: 3,
      assignedUserId: 4,
      teamId: 2,
      progressRate: 0,
      status: "not_started",
      createdBy: "Jack",
      createdAt: "2024-01-03T12:00:00Z",
      updatedAt: "2024-01-07T17:00:00Z",
      deadline: "2024-12-31",
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

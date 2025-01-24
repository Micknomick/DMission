"use client";

import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Task } from "../../lib/type";
import { useRouter } from "next/navigation";
import { User } from "../../lib/type";

import TaskList from "@/components/layout/dashboard/TaskList";
import ProgressCircle from "../../components/layout/dashboard/ProgressCircle";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const tokenHeaders = {
        "access-token": localStorage.getItem("access-token"),
        client: localStorage.getItem("client"),
        uid: localStorage.getItem("uid"),
      };

      try {
        // ユーザー情報を取得
        const userResponse = await api.get("/auth/validate_token", {
          headers: tokenHeaders,
        });
        setUser(userResponse.data.data);

        // タスクを取得
        const tasksResponse = await api.get("/tasks");
        setTasks(tasksResponse.data);

        // ProgressCircle のデータを計算
        const completed = tasksResponse.data.filter(
          (task: Task) => task.progress_rate === 100
        ).length;
        setCompletedTasks(completed);
        setTotalTasks(tasksResponse.data.length);
      } catch (err) {
        console.error("Failed to fetch user or data:", err);
        router.push("/signin"); // 認証失敗時にサインインページへリダイレクト
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
        {/* タスク一覧 */}
        <div className="flex-1">
          <TaskList tasks={tasks} userName={user?.name || "User"} />
        </div>

        {/* 進捗円 */}
        <div className="flex justify-center md:justify-start">
          <ProgressCircle completedTasks={completedTasks} totalTasks={totalTasks} />
        </div>
      </div>
    </div>
  );
}

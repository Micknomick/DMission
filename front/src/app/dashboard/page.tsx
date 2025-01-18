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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleAddTask = async (newTask: {
    title: string;
    description: string;
    priority: string;
    progress_rate: number;
    deadline: string;
    start_date: string;
    reminder_at: string;
    recurring: boolean;
    mission_id: string;
    team_id: string;
  }) => {
    try {
      const response = await api.post("/tasks", newTask);
      const createdTask: Task = response.data;

      // タスク一覧を更新
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setTotalTasks((prevTotal) => prevTotal + 1);
      if (createdTask.progress_rate === 100) {
        setCompletedTasks((prevCompleted) => prevCompleted + 1);
      }
    } catch (error) {
      console.error("Failed to add task:", error);
      alert("タスクの追加に失敗しました。");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex bg-primary text-white min-h-screen p-6 space-x-8">
        {/* タスク一覧 */}
        <TaskList tasks={tasks} userName={user?.name || "User"} />
        {/* 進捗円 */}
        <ProgressCircle completedTasks={completedTasks} totalTasks={totalTasks} />
      </div>

      {/* タスク追加モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">タスクを追加</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTask({
                  title: "新しいタスク",
                  description: "タスクの説明",
                  priority: "medium",
                  progress_rate: 0,
                  deadline: "2025-01-31",
                  start_date: "2025-01-18",
                  reminder_at: "",
                  recurring: false,
                  mission_id: "1", // 適切な ID に置き換え
                  team_id: "1", // 適切な ID に置き換え
                });
                setIsModalOpen(false);
              }}
            >
              <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
                タスクを追加
              </button>
            </form>
            <button
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
              onClick={() => setIsModalOpen(false)}
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      <button
        className="fixed bottom-6 right-6 bg-blue-500 text-white rounded-full w-16 h-16 text-2xl shadow-lg"
        onClick={() => setIsModalOpen(true)}
      >
        ＋
      </button>
    </div>
  );
}

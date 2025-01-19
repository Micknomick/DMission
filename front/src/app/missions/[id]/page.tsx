"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // useRouter をインポート
import { Mission, Task } from "@/lib/type";
import { fetchMissionById } from "@/utils/api";

const MissionDetailPage = () => {
  const params = useParams(); // useParams を使用
  const router = useRouter(); // useRouter を使用
  const id = params?.id; // パラメータを取得
  const [mission, setMission] = useState<Mission | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMissionDetails = async () => {
    try {
      if (!id) return;
      const response = await fetchMissionById(Number(id));
      setMission(response.data.mission);
      setTasks(response.data.tasks);
    } catch (err) {
      console.error("Failed to fetch mission details:", err);
      setError("ミッションの詳細を取得できませんでした。");
    }
  };

  useEffect(() => {
    fetchMissionDetails();
  }, [id]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!mission) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="bg-black text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">ミッション詳細</h1>
        <div className="mb-8 bg-primary p-4 rounded-lg shadow">
          <h2 className="text-2xl font-semibold">{mission.name}</h2>
          <p className="text-gray-300 mt-2">{mission.description}</p>
          <p className="mt-2">
            <span className="font-bold">進捗率:</span> {mission.progress_rate}%
          </p>
          <p>
            <span className="font-bold">締切期日:</span> {mission.deadline}
          </p>
        </div>

        <div className="flex justify-between mb-4">
          <button
            onClick={() => router.push("/missions")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            一覧に戻る
          </button>
          <button
            onClick={() => router.push("/missions/new")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            新規作成
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4">タスク一覧</h2>
        <table className="table-auto w-full text-left text-sm bg-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-white text-black">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Progress</th>
              <th className="px-4 py-2">Priority</th>
              <th className="px-4 py-2">Start Date</th>
              <th className="px-4 py-2">Reminder</th>
              <th className="px-4 py-2">Recurring</th>
              <th className="px-4 py-2">Deadline</th>
              <th className="px-4 py-2">User</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="text-black border-t border-gray-200">
                <td className="px-4 py-2">{task.title}</td>
                <td className="px-4 py-2">{task.description || "N/A"}</td>
                <td className="px-4 py-2">{task.progress_rate}%</td>
                <td className="px-4 py-2">{task.priority}</td>
                <td className="px-4 py-2">{task.start_date || "未設定"}</td>
                <td className="px-4 py-2">{task.reminder_at || "未設定"}</td>
                <td className="px-4 py-2">{task.recurring ? "Yes" : "No"}</td>
                <td className="px-4 py-2">{task.deadline || "未設定"}</td>
                <td className="px-4 py-2">{task.user?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MissionDetailPage;

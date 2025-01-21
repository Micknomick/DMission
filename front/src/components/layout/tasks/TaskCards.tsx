"use client";

import { FaEdit } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/type";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";

interface TaskCardsProps {
  tasks: Task[]; // Task 型の配列
  onEditClick: (task: Task) => void; // 編集用関数
}

export default function TaskCards({ tasks, onEditClick }: TaskCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <NeonGradientCard key={task.id} className="p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              {task.title}
            </h2>
          </div>
          <div className="space-y-2">
            <p className="text-gray-200">
              {task.description || "説明なし"}
            </p>
            <p className="text-sm text-gray-300">
              進捗率: {task.progress_rate || 0}%
            </p>
            <p className="text-sm text-gray-300">
              優先度: {task.priority || "low"}
            </p>
            <p className="text-sm text-gray-300">
              開始日: {task.start_date || "未設定"}
            </p>
            <p className="text-sm text-gray-300">
              締切日: {task.deadline || "未設定"}
            </p>
            <p className="text-sm text-gray-300">
              リマインダー: {task.reminder_at || "未設定"}
            </p>
            <p className="text-sm text-gray-300">
              繰り返し: {task.recurring ? "あり" : "なし"}
            </p>
            <p className="text-sm text-gray-300">
              作成者: {task.user.name || "不明"}
            </p>
            <p className="text-sm text-gray-300">
              ミッション: {task.mission?.name || "未割り当て"}
            </p>
          </div>
          <div className="flex justify-between mt-4">
            <Button size="sm" onClick={() => onEditClick(task)}>
              <FaEdit />
            </Button>
            <Link href={`/tasks/${task.id}`} className="text-black hover:underline text-sm">
              詳細へ
            </Link>
          </div>
        </NeonGradientCard>
      ))}
    </div>
  );
}

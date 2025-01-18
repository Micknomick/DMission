"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchTaskById, updateTask } from "@/utils/api";
import { Task } from "@/lib/type";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ProgressSlider from "@/components/layout/tasks/ProgressSlider";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 編集用フィールド
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progressRate, setProgressRate] = useState<number>(0);
  const [priority, setPriority] = useState("low");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [reminderAt, setReminderAt] = useState("");
  const [recurring, setRecurring] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("無効なタスクIDです。");
      setIsLoading(false);
      return;
    }

    const numericId = Number(id);
    if (isNaN(numericId)) {
      setError("無効なタスクIDです。");
      setIsLoading(false);
      return;
    }

    async function loadTask() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchTaskById(numericId);
        const taskData = response.data;
        setTask(taskData || null);
        setTitle(taskData.title);
        setDescription(taskData.description || "");
        setProgressRate(taskData.progress_rate || 0);
        setPriority(taskData.priority || "low");
        setStartDate(taskData.start_date || "");
        setDeadline(taskData.deadline || "");
        setReminderAt(taskData.reminder_at || "");
        setRecurring(taskData.recurring || false);
      } catch (err) {
        console.error("タスクの取得に失敗しました。", err);
        setError("タスクの取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    }

    loadTask();
  }, [id]);

  const handleSave = async () => {
    if (!task) return;

    try {
      const updatedTask = {
        title,
        description,
        progress_rate: progressRate,
        priority,
        start_date: startDate,
        deadline,
        reminder_at: reminderAt,
        recurring,
      };

      await updateTask(task.id, updatedTask);
      alert("タスクが更新されました。");
      router.push("/tasks");
    } catch (err) {
      console.error("タスクの更新に失敗しました。", err);
      alert("タスクの更新に失敗しました。");
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center h-screen"
      >
        <p className="text-center text-lg font-medium">タスクを読み込んでいます...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center h-screen"
      >
        <p className="text-center text-red-500 text-lg font-medium">{error}</p>
      </motion.div>
    );
  }

  if (!task) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center h-screen"
      >
        <p className="text-center text-lg font-medium">タスクが見つかりません。</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="container mx-auto py-10 px-4 bg-white shadow-lg rounded-lg space-y-8"
    >
      <div className="space-y-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトルを入力"
          className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="説明を入力"
          className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-full">
            <ProgressSlider progressRate={progressRate} setProgressRate={setProgressRate} />
          </div>
          <div className="w-40">
            <p className="text-sm font-medium text-gray-600 mb-1">優先度:</p>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="優先度を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">開始日</p>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
          <p className="text-sm font-medium text-gray-600 mb-1">締切日</p>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">締切日</p>
            <Input
              type="datetime-local"
              value={reminderAt}
              onChange={(e) => setReminderAt(e.target.value)}
              placeholder="リマインダー"
              className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <Switch
              checked={recurring}
              onCheckedChange={setRecurring}
            />
            <label className="text-sm font-medium text-gray-600">繰り返しタスク</label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>
              {task.user.name ? task.user.name.charAt(0) : "?"}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm text-gray-600">
            作成者: {task.user.name || "不明"}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-600">ミッション:</p>
          <p className="text-sm text-gray-800">
            {task.mission?.name || "未割り当て"}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg shadow-md px-6 py-2">
          保存して戻る
        </Button>
      </div>
    </motion.div>
  );
}

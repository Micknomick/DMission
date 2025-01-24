"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchMissions, fetchTeams, createTask } from "@/utils/api";
import { Mission} from "@/lib/type";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ProgressSlider from "@/components/layout/tasks/ProgressSlider";

export default function NewTaskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [progressRate, setProgressRate] = useState(0); // 初期値0
  const [deadline, setDeadline] = useState("");
  const [startDate, setStartDate] = useState("");
  const [reminderAt, setReminderAt] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [missionId, setMissionId] = useState("");

  const [missions, setMissions] = useState<Mission[]>([]);

  const router = useRouter();

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [missionsResponse, teamsResponse] = await Promise.all([
          fetchMissions(),
          fetchTeams(),
        ]);

        const allMissions = [
          ...(missionsResponse.data.personal_missions || []),
          ...(missionsResponse.data.team_missions || []),
        ];

        setMissions(allMissions);
      } catch (error) {
        console.error("ミッションまたはチームの取得に失敗しました。", error);
      }
    }
    fetchOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const task = {
      title,
      description,
      priority,
      progress_rate: progressRate, // 進捗率を送信
      deadline,
      start_date: startDate,
      reminder_at: reminderAt,
      recurring,
      mission_id: missionId,
    };

    try {
      await createTask(task);
      router.push("/tasks");
    } catch (error) {
      console.error("タスクの作成に失敗しました。", error);
      alert("タスクの作成に失敗しました。");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen py-10">
      <div className="max-w-lg mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-6">新しいタスクを作成</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* タイトル */}
          <div>
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タスクのタイトルを入力してください"
              required
              className="text-black"
            />
          </div>

          {/* 説明 */}
          <div>
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="タスクの詳細を入力してください"
              className="text-black"
            />
          </div>

          {/* 優先度 */}
          <div>
            <Label htmlFor="priority">優先度</Label>
            <Select onValueChange={(value) => setPriority(value)} defaultValue="low">
              <SelectTrigger id="priority">
                <SelectValue placeholder="優先度を選択してください" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 進捗率 */}
          <ProgressSlider
            progressRate={progressRate}
            setProgressRate={setProgressRate}
          />

          {/* ミッション */}
          <div>
            <Label htmlFor="mission">ミッション</Label>
            <Select onValueChange={(value) => setMissionId(value)} defaultValue="">
              <SelectTrigger id="mission">
                <SelectValue placeholder="ミッションを選択してください" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                {missions.length > 0 ? (
                  missions.map((mission) => (
                    <SelectItem key={mission.id} value={mission.id.toString()}>
                      {mission.name}
                    </SelectItem>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">ミッションがありません。</p>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* 締切日 */}
          <div>
            <Label htmlFor="deadline">締切日</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="text-black"
            />
          </div>

          {/* 開始日 */}
          <div>
            <Label htmlFor="start_date">開始日</Label>
            <Input
              id="start_date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-black"
            />
          </div>

          {/* リマインダー */}
          <div>
            <Label htmlFor="reminder_at">リマインダー</Label>
            <Input
              id="reminder_at"
              type="datetime-local"
              value={reminderAt}
              onChange={(e) => setReminderAt(e.target.value)}
              className="text-black"
            />
          </div>

          {/* 繰り返しタスク */}
          <div className="flex items-center space-x-4">
            <Switch id="recurring" checked={recurring} onCheckedChange={setRecurring} />
            <Label htmlFor="recurring">繰り返しタスク</Label>
          </div>

          {/* 作成ボタン */}
          <Button type="submit" className="w-full bg-blue-500">
            作成
          </Button>
        </form>
      </div>
    </div>
  );
}

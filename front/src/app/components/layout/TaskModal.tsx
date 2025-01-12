import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";

type TaskModalProps = {
  isOpen: boolean; // モーダルが開いているかどうか
  onClose: () => void; // モーダルを閉じる関数
  onSubmit: (task: { title: string; description: string; progressRate: number; missionId: number; teamId: number }) => void; // タスクを送信する関数
  missions: { id: number; name: string }[]; // 選択可能なミッション一覧
  teams: { id: number; name: string }[]; // 選択可能なチーム一覧
};

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, missions, teams }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progressRate, setProgressRate] = useState(0);
  const [missionId, setMissionId] = useState<number | null>(null);
  const [teamId, setTeamId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (missionId === null || teamId === null) {
      alert("Please select a mission and a team.");
      return;
    }
    onSubmit({ title, description, progressRate, missionId, teamId });
    setTitle("");
    setDescription("");
    setProgressRate(0);
    setMissionId(null);
    setTeamId(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {/* タイトル入力 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter task title" />
          </div>
          {/* 説明入力 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter task description" />
          </div>
          {/* Progress Rate */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Progress Rate</label>
            <Input
              type="number"
              value={progressRate}
              onChange={(e) => setProgressRate(Number(e.target.value))}
              placeholder="Enter progress rate (0-100)"
              min={0}
              max={100}
            />
          </div>
          {/* Mission選択 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Mission</label>
            <Select onValueChange={(value) => setMissionId(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a mission" />
              </SelectTrigger>
              <SelectContent>
                {missions.map((mission) => (
                  <SelectItem key={mission.id} value={mission.id.toString()}>
                    {mission.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Team選択 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Team</label>
            <Select onValueChange={(value) => setTeamId(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" variant="default">
              Add Task
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;

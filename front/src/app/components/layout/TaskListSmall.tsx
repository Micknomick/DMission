import React, { useState, useEffect } from "react";

import { Task } from "@/lib/type"; // Task型をインポート
import TaskModal from "@/app/components/layout/TaskModal";
import MissionModal from "@/app/components/layout/MissionModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";

import { FaEdit } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";

type TasksListProps = {
  tasks: Task[];
};

type Mission = {
  id: number;
  name: string;
  description: string;
};

type Team = {
  id: number;
  name: string;
};

export default function TasksListSmall({ tasks }: TasksListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの開閉状態を管理
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);


  // ミッションとチームデータをAPIから取得
  useEffect(() => {
    const fetchMissionsAndTeams = async () => {
      try {
        const missionsResponse = await fetch("/api/v1/missions");
        const missionsData = await missionsResponse.json();
        setMissions(missionsData);

        const teamsResponse = await fetch("/api/v1/teams");
        const teamsData = await teamsResponse.json();
        setTeams(teamsData);
      } catch (error) {
        console.error("Error fetching missions and teams:", error);
      }
    };

    fetchMissionsAndTeams();
  }, []);

  // モーダルを開く関数
  const openModal = () => {
    setIsModalOpen(true);
  };

  // モーダルを閉じる関数
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 新しいタスクを追加する関数
  const handleAddTask = async (newTask: {
    title: string;
    description: string;
    progressRate: number;
    missionId: number;
    teamId: number;
  }) => {
    try {
      const response = await fetch("/api/v1/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const createdTask = await response.json();
        // タスク一覧に追加
        tasks.push(createdTask);
        closeModal();
      } else {
        console.error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // 新しいミッションを追加する関数
  const handleAddMission = async (newMission: {
    name: string;
    description: string;
    teamId: number;
  }) => {
    try {
      const response = await fetch("/api/v1/missions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMission),
      });

      if (response.ok) {
        const createdMission = await response.json();
        setMissions((prevMissions) => [...prevMissions, createdMission]);
        setIsMissionModalOpen(false);
      } else {
        console.error("Failed to add mission");
      }
    } catch (error) {
      console.error("Error adding mission:", error);
    }
  };


  return (
    <div className="w-2/3 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-6 text-white">Tasks</h2>
      <div className="space-y-4">
        {tasks.map((task: Task, index: number) => (
          <div
            key={index}
            className="bg-gray-700 p-4 rounded-lg flex justify-between items-center text-white"
          >
            <div>
              <p className="font-semibold text-lg">{task.title}</p>
              <p className="text-gray-400">{task.description}</p>
              <p className="text-sm text-gray-500">
                from createdBy ユーザー名 - Deadline: {task.deadline}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <Progress
                value={task.progressRate}
                className="w-24 bg-gray-600 rounded-full h-2.5 mb-1"
              />
              <span className="text-gray-300">{task.progressRate}%</span>
            </div>
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-600">
                      <FaEdit />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit Task</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-200 hover:text-gray-600"
                    >
                      <FaCircleInfo />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Task Info</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-600"
                    >
                      <FaTrash />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Task</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ))}
      </div>
      {/* モーダルを開くボタン */}
      <Button
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
        onClick={openModal} // クリックでモーダルを開く
      >
        + Add Task
      </Button>

      {/* モーダルコンポーネント */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleAddTask}
        missions={missions} // ミッションのリスト
        teams={teams} // チームのリスト
      />

      {/* ミッションモーダルを開くボタン */}
      <Button
        className="mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
        onClick={() => setIsMissionModalOpen(true)}
      >
        + Add Mission
      </Button>

      {/* ミッションモーダル */}
      <MissionModal
        isOpen={isMissionModalOpen}
        onClose={() => setIsMissionModalOpen(false)}
        onSubmit={handleAddMission}
        teams={teams}
      />

      <div className="mt-6 bg-gray-900 p-4 rounded-lg text-center">
        <p className="font-semibold">Team 3 Mission 17 Tasks 30</p>
      </div>
    </div>
  );
}

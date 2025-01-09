import React, { useState } from "react";

import { Task } from "@/lib/type"; // Task型をインポート
import TaskModal from "./TaskModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";

import { FaEdit } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";

type TasksListProps = {
  tasks: Task[];
};

export default function TasksList({ tasks }: TasksListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの開閉状態を管理

  // モーダルを開く関数
  const openModal = () => {
    setIsModalOpen(true);
  };

  // モーダルを閉じる関数
  const closeModal = () => {
    setIsModalOpen(false);
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
                from {task.createdBy} - Deadline: {task.deadline}
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
      <TaskModal isOpen={isModalOpen} onClose={closeModal} />
      <div className="mt-6 bg-gray-900 p-4 rounded-lg text-center">
        <p className="font-semibold">Team 3 Mission 17 Tasks 30</p>
      </div>
    </div>
  );
}

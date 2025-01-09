import React from "react";

type ProgressCircleProps = {
  completedTasks: number; // 完了タスク数
  totalTasks: number; // 合計タスク数
};

const ProgressCircle: React.FC<ProgressCircleProps> = ({ completedTasks, totalTasks }) => {
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const circumference = 2 * Math.PI * 64;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-1/3 p-6 rounded-lg flex flex-col items-center text-white">
      <h2 className="text-xl font-semibold mb-6">Progress</h2>
      <div className="relative">
        <svg className="w-40 h-40 text-gray-500">
          <circle
            className="text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="64"
            cx="80"
            cy="80"
          />
          <circle
            className="text-blue-500"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r="64"
            cx="80"
            cy="80"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
          {completedTasks}/{totalTasks}
        </div>
      </div>
    </div>
  );
};

export default ProgressCircle;

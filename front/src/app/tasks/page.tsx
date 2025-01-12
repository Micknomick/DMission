"use client";

import React, { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

import { FaEdit } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";

type Task = {
  id: number;
  title: string;
  content: string;
  mission: string;
  progress: number;
  from: string;
  deadline: string;
};

type TaskListProps = {
  tasks?: Task[]; // tasks をオプショナルに変更
};

export default function TaskList({ tasks = [] }: TaskListProps) { // デフォルト値として空配列を設定
  const [activeTab, setActiveTab] = useState("progress");

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "progress") return task.progress < 100;
    if (activeTab === "done") return task.progress === 100;
    if (activeTab === "deleted") return false; // 削除済みタスクのロジックを追加
    return true;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Dmission</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
          <TabsTrigger value="deleted">Deleted</TabsTrigger>
        </TabsList>
      </Tabs>
      <Input
        type="text"
        placeholder={`Filter ${activeTab === "progress" ? "Tasks" : "Missions"} ...`}
        className="mb-4"
      />
      <Table className="bg-gray-800 text-white rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Mission</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>From</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.content}</TableCell>
              <TableCell>{task.mission}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="relative w-24 h-2 bg-gray-600 rounded-full">
                    <div
                      className="absolute h-2 bg-blue-500 rounded-full"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <span>{task.progress}%</span>
                </div>
              </TableCell>
              <TableCell>{task.from}</TableCell>
              <TableCell>{task.deadline}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <FaEdit />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <FaCircleInfo />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500">
                    <FaTrash />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

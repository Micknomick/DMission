"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/type";
import { FaEdit } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function TaskList({ tasks = [], userName }: { tasks: Task[]; userName: string }) {
  const [activeTab, setActiveTab] = useState("progress");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // タスクをフィルタリング
  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "todo") {
      return task.progress_rate === 0; // 進捗率が 0 のタスク
    }
    if (activeTab === "progress") {
      return task.progress_rate !== null && task.progress_rate > 0 && task.progress_rate < 100;
    }
    if (activeTab === "done") {
      return task.progress_rate === 100;
    }
    return true;
  });

  // ページネーション
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">{userName} Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="todo">Todo</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
        </TabsList>
      </Tabs>
      <Input
        type="text"
        placeholder={`Filter ${
          activeTab === "todo"
            ? "Todo"
            : activeTab === "progress"
            ? "Progress"
            : "Done"
        } ...`}
        className="mb-4"
      />
      <Table className="bg-black text-white border border border-neutral-500 rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Assigned By</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description || "No description"}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="relative w-24 h-2 bg-gray-600 rounded-full">
                    <div
                      className="absolute h-2 bg-blue-500 rounded-full"
                      style={{ width: `${task.progress_rate ?? 0}%` }}
                    />
                  </div>
                  <span>{task.progress_rate ?? 0}%</span>
                </div>
              </TableCell>
              <TableCell>{task.priority}</TableCell>
              <TableCell>{task.deadline}</TableCell>
              <TableCell>{task.user.name}</TableCell>
              <TableCell>アサインした人</TableCell>
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
      {/* ページネーション */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <FaArrowLeft />
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <FaArrowRight />
        </Button>
      </div>
    </div>
  );
}

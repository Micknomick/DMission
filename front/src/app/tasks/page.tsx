"use client";

import { useEffect, useState } from "react";
import { fetchTasks, updateTask } from "@/utils/api";
import { Task } from "@/lib/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import ProgressSlider from "@/components/layout/tasks/ProgressSlider";
import TaskCards from "@/components/layout/tasks/TaskCards";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState("todo"); // For tab switching
  const [searchQuery, setSearchQuery] = useState(""); // For search functionality

  // Fields for editing
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progressRate, setProgressRate] = useState(0);
  const [priority, setPriority] = useState("low");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [reminderAt, setReminderAt] = useState("");
  const [recurring, setRecurring] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetchTasks();
        setTasks(response.data || []);
      } catch (error) {
        console.error("Failed to fetch tasks.", error);
      }
    }
    loadTasks();
  }, []);

  const handleEditClick = (task: Task) => {
    setEditTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setProgressRate(task.progress_rate || 0);
    setPriority(task.priority || "low");
    setStartDate(task.start_date || "");
    setDeadline(task.deadline || "");
    setReminderAt(task.reminder_at || "");
    setRecurring(task.recurring || false);
  };

  const handleSave = async () => {
    if (!editTask) return;

    try {
      const updatedTask = await updateTask(editTask.id, {
        title,
        description,
        progress_rate: progressRate,
        priority,
        start_date: startDate,
        deadline,
        reminder_at: reminderAt,
        recurring,
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editTask.id ? { ...task, ...updatedTask } : task
        )
      );

      setEditTask(null);
    } catch (error) {
      console.error("Failed to update task.", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    // Filter tasks based on active tab and search query
    const matchesTab =
      (activeTab === "todo" && task.progress_rate === 0) ||
      (activeTab === "inprogress" && task.progress_rate > 0 && task.progress_rate < 100) ||
      (activeTab === "done" && task.progress_rate === 100);

    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <h1 className=" text-white text-3xl font-bold mb-6 text-center">Tasks</h1>

      {/* Search Bar */}
      <div className="mb-6 max-w-md mx-auto">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="タイトルで検索"
          className="w-full"
        />
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="todo"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="flex justify-center space-x-4 text-white">
          {/* Add conditional classes for background color */}
          <TabsTrigger
            value="todo"
            className={`px-4 py-2 rounded ${
              activeTab === "todo" ? "bg-white text-black" : "bg-transparent"
            }`}
          >
            Todo
          </TabsTrigger>
          <TabsTrigger
            value="inprogress"
            className={`px-4 py-2 rounded ${
              activeTab === "inprogress" ? "bg-white text-black" : "bg-transparent"
            }`}
          >
            In Progress
          </TabsTrigger>
          <TabsTrigger
            value="done"
            className={`px-4 py-2 rounded ${
              activeTab === "done" ? "bg-white text-black" : "bg-transparent"
            }`}
          >
            Done
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todo">
          <TaskCards tasks={filteredTasks} onEditClick={handleEditClick} />
        </TabsContent>
        <TabsContent value="inprogress">
          <TaskCards tasks={filteredTasks} onEditClick={handleEditClick} />
        </TabsContent>
        <TabsContent value="done">
          <TaskCards tasks={filteredTasks} onEditClick={handleEditClick} />
        </TabsContent>
      </Tabs>


            {/* Edit Dialog */}
            {editTask && (
              <Dialog open={!!editTask} onOpenChange={() => setEditTask(null)}>
                <DialogContent className="bg-white text-black">
                  <DialogTitle>タスクを編集</DialogTitle>
                  <DialogDescription>
                    タスク情報を更新してください。
                  </DialogDescription>
                  <div className="space-y-4">
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="タイトルを入力"
                      required
                    />
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="説明を入力"
                    />
                    <ProgressSlider
                      progressRate={progressRate}
                      setProgressRate={setProgressRate}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">優先度:</p>
                      <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger className="w-full">
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
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="開始日"
                    />
                    <Input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      placeholder="締切日"
                    />
                    <Input
                      type="datetime-local"
                      value={reminderAt}
                      onChange={(e) => setReminderAt(e.target.value)}
                      placeholder="リマインダー"
                    />
                    <div className="flex items-center space-x-4">
                      <Switch
                        checked={recurring}
                        onCheckedChange={setRecurring}
                      />
                      <label>繰り返しタスク</label>
                    </div>
                    <Button onClick={handleSave} className="w-full bg-blue-500 text-white">
                      保存
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        );
      }

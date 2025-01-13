import { Task } from "@/lib/type";
import { TaskList } from "@/app/components/layout/TaskList";


export default async function TasksPage() {
  // ここでデータを取得する
  const tasks: Task[] = []; // データ取得ロジックを実装

  return <TaskList tasks={tasks} />;
}


import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";

type TaskModalProps = {
  isOpen: boolean; // モーダルが開いているかどうか
  onClose: () => void; // モーダルを閉じるための関数
};

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Task</DialogTitle>
        </DialogHeader>
        <form>
          {/* タイトル入力 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <Input type="text" placeholder="Enter task title" />
          </div>
          {/* 説明入力 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <Textarea placeholder="Enter task description" />
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

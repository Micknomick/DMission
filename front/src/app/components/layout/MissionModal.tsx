import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

type MissionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mission: { name: string; description: string; teamId: number }) => void;
  teams: { id: number; name: string }[];
};

const MissionModal: React.FC<MissionModalProps> = ({ isOpen, onClose, onSubmit, teams }) => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [teamId, setTeamId] = React.useState(teams.length > 0 ? teams[0].id : 0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim() || !teamId) {
      alert("Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
    await onSubmit({ name, description, teamId: Number(teamId) });
    setIsSubmitting(false);
    onClose(); // モーダルを閉じる
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Mission</DialogTitle>
        </DialogHeader>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Mission Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Team</label>
            {teams.length > 0 ? (
              <select
                value={teamId}
                onChange={(e) => setTeamId(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-500">No teams available.</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} className="bg-green-500" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Add Mission"}
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

export default MissionModal;

import { Mission } from "@/lib/type";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import api from "@/utils/api";

type MissionTableProps = {
  missions: Mission[];
  onUpdate: () => void; // 更新後に親コンポーネントから再取得するためのコールバック
};

const MissionTable = ({ missions, onUpdate }: MissionTableProps) => {
  const handleDelete = async (mission: Mission) => {
    try {
      if (!mission.deleted_at) {
        // ソフトデリートリクエスト
        await api.delete(`/missions/${mission.id}`);
        alert("ミッションが削除されました（ソフトデリート）。");
      } else {
        // ハードデリートリクエスト
        await api.delete(`/missions/${mission.id}?hard_delete=true`);
        alert("ミッションが完全に削除されました。");
      }
      onUpdate(); // 親コンポーネントにリストの更新を通知
    } catch (error) {
      console.error("削除に失敗しました:", error);
    }
  };

  return (
    <table className="table-auto w-full text-left text-sm bg-white rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-white text-black">
          <th className="px-4 py-2">Title</th>
          <th className="px-4 py-2">Content</th>
          <th className="px-4 py-2">Team</th>
          <th className="px-4 py-2">Progress</th>
          <th className="px-4 py-2">Deadline</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {missions.map((mission) => (
          <tr key={mission.id} className="text-black border-t border-gray-200">
            <td className="px-4 py-2">{mission.name}</td>
            <td className="px-4 py-2">{mission.description}</td>
            <td className="px-4 py-2">{mission.team}</td>
            <td className="px-4 py-2">
              <div className="flex items-center">
                <span className="mr-2">{mission.progress}%</span>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${mission.progress}%` }}
                  />
                </div>
              </div>
            </td>
            <td className="px-4 py-2">{mission.deadline}</td>
            <td className="px-4 py-2 flex space-x-2">
              <button className="text-primary px-2 py-1 rounded hover:bg-primary hover:text-white">
                <FaCircleInfo />
              </button>
              <button className="text-primary px-2 py-1 rounded hover:bg-primary hover:text-white">
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(mission)}
                className="text-accent px-2 py-1 rounded hover:bg-accent hover:text-white"
              >
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MissionTable;

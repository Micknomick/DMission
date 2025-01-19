"use client";

import { useState } from "react";
import { Mission } from "@/lib/type";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { deleteMission, updateMission } from "@/utils/api"; // updateMission を追加

type MissionTableProps = {
  missions: Mission[];
  onUpdate: () => void; // 更新後に親コンポーネントから再取得するためのコールバック
};

const MissionTable = ({ missions, onUpdate }: MissionTableProps) => {
  const router = useRouter(); // Next.js の useRouter フックを使用
  const [isModalOpen, setModalOpen] = useState(false); // モーダルの表示状態
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null); // 選択されたミッション

  const handleDelete = async (mission: Mission) => {
    try {
      await deleteMission(mission.id, true); // 完全削除
      alert("ミッションを削除しました。");
      onUpdate(); // 親コンポーネントにリストの更新を通知
    } catch (error) {
      console.error("削除に失敗しました:", error);
    }
  };

  const handleViewDetails = (missionId: number) => {
    router.push(`/missions/${missionId}`); // 詳細画面に遷移
  };

  const handleEdit = (mission: Mission) => {
    setSelectedMission(mission); // 編集対象のミッションをセット
    setModalOpen(true); // モーダルを表示
  };

  const handleModalClose = () => {
    setModalOpen(false); // モーダルを閉じる
    setSelectedMission(null); // 選択中のミッションをリセット
  };

  const handleSave = async () => {
    if (selectedMission) {
      try {
        // DBを更新するAPIリクエストを送信
        await updateMission(selectedMission.id, {
          name: selectedMission.name,
          description: selectedMission.description,
        });

        alert("ミッションを更新しました。");
        setModalOpen(false); // モーダルを閉じる
        onUpdate(); // 親コンポーネントを更新
      } catch (error) {
        console.error("ミッションの更新に失敗しました:", error);
        alert("ミッションの更新に失敗しました。");
      }
    }
  };

  return (
    <>
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
                  <span className="mr-2">{mission.progress_rate}%</span>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full"
                      style={{ width: `${mission.progress_rate}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-4 py-2">{mission.deadline}</td>
              <td className="px-4 py-2 flex space-x-2">
                <button
                  onClick={() => handleViewDetails(mission.id)}
                  className="text-primary px-2 py-1 rounded hover:bg-primary hover:text-white"
                >
                  <FaCircleInfo />
                </button>
                <button
                  onClick={() => handleEdit(mission)} // 編集モーダルを開く
                  className="text-primary px-2 py-1 rounded hover:bg-primary hover:text-white"
                >
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

      {/* 編集モーダル */}
      {isModalOpen && selectedMission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-black p-6 rounded-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Edit Mission</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={selectedMission.name}
                onChange={(e) =>
                  setSelectedMission({ ...selectedMission, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2 text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Content</label>
              <textarea
                value={selectedMission.description}
                onChange={(e) =>
                  setSelectedMission({ ...selectedMission, description: e.target.value })
                }
                className="w-full border rounded px-3 py-2 text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Deadline</label>
                <input
                  type="date" // 日付入力用のタイプ
                  value={selectedMission.deadline || ""} // 初期値を設定
                  onChange={(e) =>
                    setSelectedMission({ ...selectedMission, deadline: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 text-black"
                />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleModalClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave} // 編集内容を保存
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MissionTable;

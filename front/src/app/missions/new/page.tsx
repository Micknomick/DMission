'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createMission, fetchTeams } from "@/utils/api";
import { Team } from '@/lib/type';

const NewMissionPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [teamId, setTeamId] = useState('');
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // チームデータを取得
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await fetchTeams();
        console.log("Fetched Teams:", response.data); // デバッグ
        setTeams(response.data); // チームデータを状態に保存
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError('チームデータの取得に失敗しました。');
      }
    };

    loadTeams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamId) {
      setError('チームを選択してください。');
      return;
    }

    try {
      const missionData = {
        mission: {
          name,
          description,
          deadline,
          team_id: Number(teamId),
        },
      };
      await createMission(missionData);
      router.push('/missions/');
    } catch (err) {
      console.error("Mission creation failed:", err);
      setError('ミッションの作成に失敗しました。');
    }
  };

  return (
    <div className="bg-primary text-white h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Missionを作成する</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
          <div>
            <label htmlFor="name" className="block mb-2">Mission Name</label>
            <input
              type="text"
              id="name"
              placeholder="ミッション名を入力してください"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-600 bg-gray-700 p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-2">Overview</label>
            <textarea
              id="description"
              placeholder="説明文を入力してください"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="deadline" className="block mb-2">Deadline</label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border border-gray-700 bg-gray-700 p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="team" className="block mb-2">Select Team</label>
            <select
              id="team"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 p-2 rounded"
            >
              <option value="">チームを選択してください</option>
              {teams.map((team: Team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 text-center mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMissionPage;

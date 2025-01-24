'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createMission, fetchTeams } from "@/utils/api";
import { Team, MissionInput } from '@/lib/type';
import { ShimmerButton } from '@/components/ui/shimmer-button';

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

    try {
      // MissionInput 型に対応する missionData を明確に定義
      const missionData: MissionInput = {
        mission: {
          name,
          description,
          deadline,
          ...(teamId ? { team_id: Number(teamId) } : 0),
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
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">New Mission</h1>
        {error && <div className="text-blue-500 mb-4">{error}</div>}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8"
        >
          <div>
            <label htmlFor="name" className="block mb-2">Mission Name</label>
            <input
              type="text"
              id="name"
              placeholder="ミッション名を入力してください"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-600 bg-primary p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-2">Overview</label>
            <textarea
              id="description"
              placeholder="説明文を入力してください"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-600 bg-primary p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="deadline" className="block mb-2">Deadline</label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border border-gray-700 bg-primary p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="team" className="block mb-2">Select Team</label>
            <select
              id="team"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full border border-gray-600 bg-primary p-2 rounded"
            >
              <option value="">チームを選択してください</option>
              {teams.map((team: Team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-center col-span-1 sm:col-span-2 text-center mt-4">
            <ShimmerButton
              type="submit"
              className="px-6 py-2 rounded hover:bg-blue-500 w-full sm:w-auto"
            >
              Create
            </ShimmerButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMissionPage;

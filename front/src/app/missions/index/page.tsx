"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Mission } from "@/lib/type";

import { AxiosError } from "axios";

// API レスポンスの型を定義
interface MissionResponse {
  personal_missions: Mission[];
  team_missions: Mission[];
}

// エラーの型をより具体的に定義
type ApiError = Error | AxiosError;

const MissionList = () => {
  const [personalMissions, setPersonalMissions] = useState<Mission[]>([]);
  const [teamMissions, setTeamMissions] = useState<Mission[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await api.get<MissionResponse>("/missions");
        setPersonalMissions(response.data.personal_missions);
        setTeamMissions(response.data.team_missions);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "データの取得に失敗しました。";
        setError(errorMessage);
      }
    };

    void fetchMissions();
  }, []);

  if (error) {
    return (
      <div className="text-red-500">
        {error}
      </div>
    );
  }

  const MissionItem = ({ mission }: { mission: Mission }) => (
    <li key={mission.id} className="py-2">
      {mission.name}
      <span className="ml-2">
        （{mission.isCompleted ? "完了" : "未完了"}）
      </span>
    </li>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ミッション一覧</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">個人ミッション</h2>
        <ul className="space-y-2">
          {personalMissions.map((mission) => (
            <MissionItem key={mission.id} mission={mission} />
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">チームミッション</h2>
        <ul className="space-y-2">
          {teamMissions.map((mission) => (
            <MissionItem key={mission.id} mission={mission} />
          ))}
        </ul>
      </section>
    </div>
  );
};

export default MissionList;

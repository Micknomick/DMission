"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Mission } from "@/lib/type";

const MissionList = () => {
  const [personalMissions, setPersonalMissions] = useState<Mission[]>([]);
  const [teamMissions, setTeamMissions] = useState<Mission[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await api.get("/missions");
        setPersonalMissions(response.data.personal_missions);
        setTeamMissions(response.data.team_missions);
      } catch (err: any) {
        setError(err.message || "データの取得に失敗しました。");
      }
    };

    fetchMissions();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>ミッション一覧</h1>

      <section>
        <h2>個人ミッション</h2>
        <ul>
          {personalMissions.map((mission) => (
            <li key={mission.id}>
              {mission.name}（{mission.isCompleted ? "完了" : "未完了"}）
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>チームミッション</h2>
        <ul>
          {teamMissions.map((mission) => (
            <li key={mission.id}>
              {mission.name}（{mission.isCompleted ? "完了" : "未完了"}）
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default MissionList;

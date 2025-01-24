"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Mission } from "@/lib/type";

import MissionTabs from "@/components/layout/missions/MissionTabs";
import MissionSearch from "@/components/layout/missions/MissionSearch";
import MissionTable from "@/components/layout/missions/MissionTable";
import MissionPagination from "@/components/layout/missions/MissionPagination";

// API レスポンスの型を定義
type MissionResponse = {
  personal_missions: Mission[];
  team_missions: Mission[];
};

const MissionList = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Progress"); // 現在選択されているタブ
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1); // 現在のページ番号
  const itemsPerPage = 10; // 1ページに表示するアイテム数

  const fetchMissions = async () => {
    try {
      const response = await api.get<MissionResponse>("/missions");
      const { personal_missions, team_missions } = response.data;

      // 個人ミッションとチームミッションを1つの配列に統合してセット
      setMissions([...personal_missions, ...team_missions]);
    } catch (err) {
      console.error("Failed to fetch missions:", err);
      setError("データの取得に失敗しました。");
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  // タブの状態に応じたフィルタリング
  const filteredMissions = missions.filter((mission) => {
    if (activeTab === "Todo") return mission.progress_rate === 0;
    if (activeTab === "Progress") return mission.progress_rate > 0 && mission.progress_rate < 100;
    if (activeTab === "Done") return mission.progress_rate === 100;
    return true;
  });

  // 検索フィルター処理
  const searchedMissions = filteredMissions.filter((mission) =>
    mission.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ページネーション処理
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMissions = searchedMissions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(searchedMissions.length / itemsPerPage);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-black text-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mission一覧</h1>
        {/* タブ切り替え */}
        <MissionTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* 検索フィールド */}
        <MissionSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        {/* テーブル */}
        <MissionTable missions={paginatedMissions} onUpdate={fetchMissions} />
        {/* ページネーション */}
        <MissionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          onPrevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        />
      </div>
    </div>
  );
};

export default MissionList;

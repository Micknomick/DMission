'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchTeams } from '@/utils/api';
import { Team } from '@/lib/type';

const TeamsGridWithSlider = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await fetchTeams();
        setTeams(response.data);
      } catch (err) {
        console.error('Failed to fetch teams:', err);
      }
    };

    loadTeams();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-purple-600 text-center py-4">
        <h1 className="text-3xl font-bold">所属チーム一覧</h1>
      </header>
      <div className="container mx-auto py-8 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
};

const TeamCard = ({ team }: { team: Team }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = [
    { title: 'Name', content: team.name },
    { title: 'Description', content: team.description },
    { title: 'Created By', content: `User Name: ${team.created_by_user_name}` },
  ];

  // 自動スライダー
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 3000); // 3秒ごとに次のスライドへ

    return () => clearInterval(interval); // クリーンアップ
  }, [items.length]);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % items.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div className="bg-gray-800 p-6 rounded-lg relative">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-xl font-bold">{items[currentIndex].title}</h2>
        <p className="mt-2">{items[currentIndex].content}</p>
      </motion.div>
      {/* スライダーの操作ボタン */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-gray-700 p-2 rounded-full"
        onClick={prevSlide}
      >
        ◀
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-gray-700 p-2 rounded-full"
        onClick={nextSlide}
      >
        ▶
      </button>
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded block mx-auto"
        onClick={() => (window.location.href = `/teams/${team.id}`)}
      >
        View Details
      </button>
    </div>
  );
};

export default TeamsGridWithSlider;

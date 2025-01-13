'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createMission } from "@/utils/api"; // API関数をインポート
import Footer from '@/app/components/layout/Footer';

const NewMissionPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('access-token');
    const client = localStorage.getItem('client');
    const uid = localStorage.getItem('uid');

    if (!token || !client || !uid) {
      setError('認証情報が見つかりません。再ログインしてください。');
      return;
    }

    try {
      await createMission(
        {
          name,
          description,
          deadline,
          isCompleted,
        },
      );
      router.push('/missions/index');
    } catch (err) {
      console.error(err);
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
              placeholder="チーム名を入力してください"
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
            <input
              type="text"
              id="team"
              placeholder="チームを選択してください"
              className="w-full border border-gray-600 bg-gray-700 p-2 rounded"
            />
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

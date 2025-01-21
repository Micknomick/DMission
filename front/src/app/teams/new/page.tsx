'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTeam } from "@/utils/api"; // チーム作成用のAPI関数をインポート
import { TeamInput } from '@/lib/type';

const NewTeamPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data: TeamInput = { name, description }; // 型を明示
      await createTeam(data); // 型安全に呼び出し
      router.push('/teams');
    } catch (err) {
      console.error('Error creating team:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'チームの作成に失敗しました。'
      );
    }
  };

  return (
    <div className="bg-primary text-white h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">New Team</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block mb-2">Team Name</label>
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
            <label htmlFor="description" className="block mb-2">Description</label>
            <textarea
              id="description"
              placeholder="説明文を入力してください"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 p-2 rounded"
            />
          </div>
          <div className="text-center">
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

export default NewTeamPage;

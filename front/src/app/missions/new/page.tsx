'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createMission } from "@/utils/api"; // API関数をインポート

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
  } catch (err: any) {
    console.error(err);
    setError(err.response?.data?.error || 'ミッションの作成に失敗しました。');
  }
};

  return (
    <div>
      <h1>ミッション作成</h1>
      {error && <div className="text-red-500">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">ミッション名</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border"
          />
        </div>
        <div>
          <label htmlFor="description">説明</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border"
          />
        </div>
        <div>
          <label htmlFor="deadline">締切</label>
          <input
            type="date"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="border"
          />
        </div>
        <div>
          <label htmlFor="isCompleted">完了状態</label>
          <input
            type="checkbox"
            id="isCompleted"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          作成
        </button>
      </form>
    </div>
  );
};

export default NewMissionPage;

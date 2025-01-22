'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { sendResetPasswordEmail } from '@/lib/auth';

interface IFormInput {
  email: string;
}

export default function RequestResetPassword() {
  const [message, setMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await sendResetPasswordEmail({
        email: data.email,
        redirect_url: `https://dmission-app.vercel.app/newpassword`,
      });

      if (response.success) {
        setMessage('パスワードリセットの手順を記載したメールを送信しました');
      } else {
        setMessage('エラーが発生しました');
      }
    } catch (error) {
      setMessage('エラーが発生しました');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">パスワードリセット</h1>

      {message && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            メールアドレス
          </label>
          <input
            {...register('email', {
              required: '必須項目です',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '有効なメールアドレスを入力してください',
              },
            })}
            className="w-full p-2 border rounded"
            type="email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.email.message as string}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          送信
        </button>
      </form>
    </div>
  );
}

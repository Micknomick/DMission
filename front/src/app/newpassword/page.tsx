'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { updatePassword } from '@/lib/auth';

interface IFormInput {
  password: string;
  password_confirmation: string;
}

export default function UpdatePassword() {
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<IFormInput>();

  const onSubmit = async (data: {
    password: string,
    password_confirmation: string
  }) => {
    try {
      const response = await updatePassword({
        reset_password_token: searchParams.get('reset_password_token') || '',
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      if (response.success) {
        setMessage('パスワードを更新しました');
        setTimeout(() => {
          router.push('/signin');
        }, 2000);
      } else {
        setMessage('エラーが発生しました');
      }
    } catch (error) {
      console.error(error);
      setMessage('エラーが発生しました');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">新しいパスワードの設定</h1>

      {message && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            新しいパスワード
          </label>
          <input
            {...register('password', {
              required: '必須項目です',
              minLength: {
                value: 8,
                message: 'パスワードは8文字以上で入力してください',
              },
            })}
            className="w-full p-2 border rounded"
            type="password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message as string}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            パスワード（確認）
          </label>
          <input
            {...register('password_confirmation', {
              required: '必須項目です',
              validate: (val: string) => {
                if (watch('password') != val) {
                  return 'パスワードが一致しません';
                }
              },
            })}
            className="w-full p-2 border rounded"
            type="password"
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password_confirmation.message as string}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          パスワードを更新
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null); // 初期値をnullに変更
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // 初期値をnullに変更
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // nullでリセット
    setSuccessMessage(null); // nullでリセット

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registration: {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
          },
        }),
      });

      if (response.ok) {
        setSuccessMessage("Account created successfully!");
        // const responseData = await response.json();

        // トークン情報を保存 (サインアップ後の認証用)
        localStorage.setItem("access-token", response.headers.get("access-token") || "");
        localStorage.setItem("client", response.headers.get("client") || "");
        localStorage.setItem("uid", response.headers.get("uid") || "");

      // サインアップ成功時に/dashboardに遷移
      router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.errors?.full_messages?.join(", ") || "Failed to sign up.");
      }
    } catch (error) {
      console.error("Sign up error:", error); // コンソールにエラーを出力
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-purple-600 to-blue-300 text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md w-11/12 max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold">Dmission</h1>
          <h2 className="text-xl mt-2">新規登録</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 名前フィールド */}
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1">アカウント名</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* メールフィールド */}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1">メールアドレス</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* パスワードフィールド */}
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1">パスワード</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* パスワード確認フィールド */}
          <div className="flex flex-col">
            <label htmlFor="passwordConfirmation" className="mb-1">パスワード (確認用)</label>
            <input
              id="passwordConfirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* サインアップボタン */}
          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition"
          >
            Sign up With Email
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-700" />
          <span className="px-2 text-gray-400">OR</span>
          <hr className="flex-grow border-gray-700" />
        </div>

        {/* Google サインアップ */}
        <button
          type="button"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-lg transition"
        >
          Sign up With Google
        </button>

        {/* エラー・成功メッセージ */}
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}

        {/* Footer */}
        <div className="mt-6 text-center text-gray-400">
          <p>Already using Dmission?</p>
          <a href="/signin" className="text-purple-500 underline hover:text-purple-400">
            Sign In
          </a>
          <div className="mt-4">
            <a href="/privacy" className="text-gray-500 hover:text-gray-300">
              Privacy & Term
            </a>{" "}
            |{" "}
            <a href="/contact" className="text-gray-500 hover:text-gray-300">
              Contact
            </a>
          </div>
          <p className="mt-4 text-xs">Copyright © Mick. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

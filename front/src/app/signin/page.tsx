"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // App Routerでは`next/navigation`を使用

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // ルーターを初期化

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/sign_in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        // サインイン成功時にトークン情報をローカルストレージに保存
        const headers = response.headers;
        localStorage.setItem("access-token", headers.get("access-token") || "");
        localStorage.setItem("client", headers.get("client") || "");
        localStorage.setItem("uid", headers.get("uid") || "");

        // ダッシュボード画面へリダイレクト
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Invalid email or password");
      }
    } catch (e) {
      console.error("Error during login:", e);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-purple-600 to-blue-300 text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md w-11/12 max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold">Dmission</h1>
          <h2 className="text-xl mt-2">ログイン</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Remember me */}
          <div className="field flex items-center w-full">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>

          {/* サインインボタン */}
          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition"
          >
            Log in
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-700" />
          <span className="px-2 text-gray-400">OR</span>
          <hr className="flex-grow border-gray-700" />
        </div>

        {/* Google ログイン */}
        <button
          type="button"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-lg transition"
        >
          Log in With Google
        </button>

        {/* エラーメッセージ */}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        {/* Footer */}
        <div className="mt-6 text-center text-gray-400">
          <p>Don&apos;t have an account?</p>
          <a href="/signup" className="text-purple-500 underline hover:text-purple-400">
            Sign Up
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

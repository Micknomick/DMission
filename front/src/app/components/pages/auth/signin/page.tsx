"use client";

import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/v1/users/sign_in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Cookieを送信する設定
        body: JSON.stringify({
          user: { email, password, remember_me: rememberMe },
        }),
      });

      if (response.ok) {
        // サインイン成功時の処理
        window.location.href = "/dashboard"; // 必要に応じてリダイレクト
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Invalid email or password");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black text-white">
      <div className="text-center">
        <h2 className="text-4xl mt-2">サインイン</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <div className="field flex flex-col items-start w-full">
          <label htmlFor="email" className="mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-4 py-2 bg-gray-200 rounded-lg focus:outline-none"
          />
        </div>

        <div className="field flex flex-col items-start w-full">
          <label htmlFor="password" className="mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full px-4 py-2 bg-gray-200 rounded-lg focus:outline-none"
          />
        </div>

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

        <div className="actions w-full">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Log in
          </button>
        </div>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="mt-4">
        <a
          href="/users/password/new"
          className="text-blue-400 underline hover:text-blue-300"
        >
          Forgot your password?
        </a>
      </div>
    </div>
  );
}

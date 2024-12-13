"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ログイン状態をチェックする（Rails APIから情報を取得）
  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const response = await fetch("http://localhost:3000/api/v1/auth_status", {
          credentials: "include", // Cookieを送信する
        });
        const data = await response.json();
        setIsLoggedIn(data.signed_in);
      } catch (error) {
        console.error("Failed to check login status:", error);
      }
    }
    checkLoginStatus();
  }, []);

  return (
    <div className="bg-black flex flex-col h-screen">
      {/* DMissionを中央に配置 */}
      <div className="flex justify-center items-center">
        <h1 className="font-bold text-white text-8xl sm:text-8xl md:text-9xl lg:text-[14rem]">
          DMission
        </h1>
      </div>

      {/* 左下に配置する要素 */}
      <div className="w-full p-8">
        <div className="text-white">
          <div className="text-center md:text-left">
          <p className="text-4xl mb-2">Complete Your Tasks.</p>
          <p className="text-4xl mb-6">Conquer Your Day.</p>
          </div>
          <div className="flex space-x-4 justify-center md:justify-start">
            {isLoggedIn ? (
              <>
                {/* ログアウトボタン */}
                <a
                  href="http://localhost:3000/users/sign_out"
                  className="bg-white text-black px-4 py-2 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    fetch("http://localhost:3000/users/sign_out", {
                      method: "DELETE",
                      credentials: "include", // Cookieを送信
                    })
                      .then(() => setIsLoggedIn(false))
                      .catch((error) =>
                        console.error("Failed to log out:", error)
                      );
                  }}
                >
                  Log Out
                </a>
              </>
            ) : (
              <>
                {/* サインインボタン */}
                <Link
                  href="http://localhost:3000/users/sign_in"
                  className="bg-white text-black px-4 py-2 rounded"
                >
                  <button>Sign In</button>
                </Link>
                {/* サインアップボタン */}
                <Link
                  href="http://localhost:3000/users/sign_up"
                  className="bg-white text-black px-4 py-2 rounded"
                >
                  <button>Sign Up</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

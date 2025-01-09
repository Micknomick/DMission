"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const response = await fetch("http://localhost:3000/api/v1/auth/validate_token", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(!!data.data);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Failed to check login status:", error);
        setIsLoggedIn(false);
      }
    }
    checkLoginStatus();
  }, []);

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/sign_out", {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setIsLoggedIn(false);
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black flex flex-col min-h-screen">
      {/* メインセクション */}
      <div className="flex flex-col justify-center items-center flex-grow text-center">
        <h1 className="font-extrabold text-white text-8xl sm:text-8xl md:text-9xl lg:text-[14rem]">
          DMission
        </h1>
        <div className="mt-4">
          <p className="text-4xl font-light italic mb-2 text-white">Complete Your Tasks.</p>
          <p className="text-4xl font-light italic text-gray-400">Conquer Your Day.</p>
        </div>
        <div className="flex space-x-4 justify-center mt-6">
          {isLoggedIn ? (
            <a
              href="#"
              className="bg-white text-black px-4 py-2 rounded shadow hover:bg-gray-300"
              onClick={handleLogout}
            >
              Log Out
            </a>
          ) : (
            <>
              <Link href="/signin">
                <Button>Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

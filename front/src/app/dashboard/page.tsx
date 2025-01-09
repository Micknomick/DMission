"use client";

import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useRouter } from "next/navigation";
import { User } from "../../lib/type";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const tokenHeaders = {
        "access-token": localStorage.getItem("access-token"),
        client: localStorage.getItem("client"),
        uid: localStorage.getItem("uid"),
      };

      try {
        const response = await api.get("/auth/validate_token", { headers: tokenHeaders });
        setUser(response.data.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        router.push("/signin"); // 認証失敗時にサインインページへリダイレクト
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome to your Dashboard, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <p>This page is private.</p>
    </div>
  );
}

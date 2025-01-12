import { SignUpParams, MissionInput } from "@/lib/type";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1", // Rails APIのベースURL
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// リクエストごとに認証トークンを自動的にヘッダーに追加
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access-token");
  const client = localStorage.getItem("client");
  const uid = localStorage.getItem("uid");

  if (token && client && uid) {
    config.headers["access-token"] = token;
    config.headers["client"] = client;
    config.headers["uid"] = uid;
  }

  return config;
});


// API呼び出し関数を定義
export const fetchSession = () => api.get("/auth/sessions");
export const signUp = (data: SignUpParams) => api.post("/auth", data);
export const createMission = (data: MissionInput) => api.post("/missions", data);

export default api;

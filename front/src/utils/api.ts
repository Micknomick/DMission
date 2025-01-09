import { SignUpParams } from "@/lib/type";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1", // Rails APIのベースURL
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// API呼び出し関数を定義
export const fetchSession = () => api.get("/auth/sessions");
export const signUp = (data: SignUpParams) => api.post("/auth", data);

export default api;

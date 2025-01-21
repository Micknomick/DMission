import { SignUpParams, MissionInput, TaskInput, Task, Mission, TeamInput} from "@/lib/type";
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

// ミッション関連
export const fetchMissions = () => api.get("/missions");
export const createMission = (data: MissionInput) => api.post("/missions", data);
export const fetchMissionById = (missionId: number) => api.get(`/missions/${missionId}`);
export const deleteMission = async (missionId: number, isSoftDelete: boolean) => {
  if (isSoftDelete) {
    return await api.delete(`/missions/${missionId}`);
  } else {
    return await api.delete(`/missions/${missionId}?hard_delete=true`);
  }
};
export const updateMission = async (missionId: number, data: Partial<Mission>) => {
  return await api.put(`/missions/${missionId}`, data); // APIリクエストを送信
};

//チーム関連
export const fetchTeams = () => api.get("/teams");
export const createTeam = (data: TeamInput) => api.post("/teams", data);
export const fetchTeamById = (teamId: number) => api.get(`/teams/${teamId}`);


//タスク関連
export const createTask = (data:TaskInput) => api.post("/tasks", data);
export const fetchTasks = () => api.get("/tasks");
export const updateTask = async (taskId: number, data: Partial<Task>) => {
  const response = await api.put(`/tasks/${taskId}`, data);
  return response.data;
};
export async function fetchTaskById(taskId: number) {
  return await api.get(`/tasks/${taskId}`);
}

export default api;

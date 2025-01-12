// サインアップ
export interface SignUpParams {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

// サインイン
export interface SignInParams {
  email: string
  password: string
}

// ユーザー
export interface User {
  id: number
  uid: string
  provider: string
  email: string
  name: string
  nickname?: string
  image?: string
  allowPasswordChange: boolean
  created_at: Date
  updated_at: Date
}

// タスク
export type Task = {
  id: number;
  title: string;
  description: string | null;
  missionId: number;
  createdByUserId: number | null;
  assignedUserId: number | null;
  teamId: number | null;
  progressRate: number | null;
  status: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deadline: string;
};

// ミッション
export interface Mission {
  id?: number; // データベースから取得後に存在する
  name: string;
  description?: string;
  ownerType: string;
  userId: number;
  teamId: number;
  isCompleted: boolean;
  createdAt?: string; // Railsで自動生成されるためオプショナル
  updatedAt?: string; // Railsで自動生成されるためオプショナル
}

export interface MissionInput {
  name: string;
  description?: string;
  deadline: string;
  isCompleted: boolean;
}

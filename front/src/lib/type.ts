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
  progress_rate: number;
  priority: string;
  start_date: string | null;
  reminder_at: string | null;
  recurring: boolean | null;
  createdByUserId: number | null;
  assignedUserId: number | null;
  teamId: number | null;
  createdAt: string;
  updatedAt: string;
  deadline: string;
  user: User;
  mission: Mission;
};

// タスク
export interface TaskInput {
  title: string;
  description: string;
  priority: string;
  progress_rate: number;
  deadline: string;
  start_date: string;
  reminder_at: string;
  recurring: boolean;
  mission_id: string;
  team_id: string;
}

// ミッション
export interface Mission {
  id: number; // データベースから取得後に存在する
  name: string;
  description?: string;
  progress: number;
  deadline: string;
  deleted_at: string | null;
  ownerType: 'Personal' | 'Team';
  user: number;
  team: number;
  isCompleted: boolean;
  createdAt?: string; // Railsで自動生成されるためオプショナル
  updatedAt?: string; // Railsで自動生成されるためオプショナル
}

export interface MissionInput {
  mission: {
    name: string;
    description: string;
    deadline: string;
    is_completed: boolean;
    progress: number;
  };
};

export interface Team {
  id: number;
  name: string;
}

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

export interface ResetPasswordParams {
  email: string;
  redirect_url: string;
}

export interface UpdatePasswordParams {
  reset_password_token: string;
  password: string;
  password_confirmation: string;
}

// ユーザー
export interface User {
  id: number
  uid: string
  provider: string
  email: string
  name: string
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
  createdAt: string;
  updatedAt: string;
  deadline: string;
  user: User;
  mission: Mission;
  team: Team;
};

// タスクの入力
export interface TaskInput {
  title: string;
  description: string;
  priority: string;
  progress_rate: number;
  deadline: string;
  start_date: string;
  reminder_at: string;
  recurring: boolean;
}

// ミッション
export interface Mission {
  id: number;
  name: string;
  description?: string;
  progress_rate: number;
  deadline: string;
  deleted_at: string | null;
  ownerType: 'Personal' | 'Team';
  user: User;
  team: Team;
  tasks: Task[];
  isCompleted: boolean;
  createdAt?: string; // Railsで自動生成されるためオプショナル
  updatedAt?: string; // Railsで自動生成されるためオプショナル
}

// ミッションの入力
export interface MissionInput {
  mission: {
    name: string;
    description: string;
    deadline: string;
    team_id?: number;
  };
};


// チーム
export interface Team {
  id: number;
  name: string;
  description: string;
  created_by_user_name: string;
  members: User[];
  missions: Mission[];
  createdAt?: string;
  updatedAt?: string;
}

// チームのインプット
export interface TeamInput {
    name: string;
    description: string;
}

export type Invitation = {
  id: number;
  team: { name: string };
  status: string;
  token: string
};

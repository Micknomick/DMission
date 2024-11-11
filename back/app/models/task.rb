class Task < ApplicationRecord
  belongs_to :mission
  belongs_to :created_by_user, class_name: "User", foreign_key: 'created_by_user_id' # 作成者のユーザー
  belongs_to :created_by_user, class_name: "User", foreign_key: "created_by_user_id"
  belongs_to :team, optional: true
  has_many :task_approval_histories, dependent: :destroy # タスクに関連する承認履歴
  # スコープ：個人タスクとチームタスクを区別
  scope :personal, -> { where(team_id: nil) }
  scope :team, -> { where.not(team_id: nil) }
end

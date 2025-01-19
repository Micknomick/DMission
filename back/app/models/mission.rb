class Mission < ApplicationRecord
  # 個人ミッション
  belongs_to :user, optional: true, class_name: "User"
  # チームミッション
  belongs_to :team, optional: true, class_name: "Team"
  # Missionに紐づくタスク（Missionが削除されたらタスクも削除
  has_many :tasks, dependent: :destroy

  # スコープ：個人ミッションとチームミッションを区別
  scope :personal, -> { where.not(user_id: nil).where(team_id: nil) }
  scope :team, -> { where.not(team_id: nil).where(user_id: nil) }

  # 進捗率を計算するメソッド
  def calculate_progress_rate(tasks_data = nil)
    # tasks_data が指定されていない場合は関連タスクを直接使用
    tasks_to_calculate = tasks_data || tasks

    # ロード済みデータを活用して計算
    task_count = tasks_to_calculate.size
    return 0 if task_count.zero?

    total_progress = tasks_to_calculate.sum { |task| task.progress_rate.to_f }
    (total_progress / task_count).round
  end

  # ユーザーがアクセス可能かどうか判定
  def accessible_by?(user)
    self.user_id == user.id || (self.team_id && user.teams.exists?(id: self.team_id))
  end

  # 権限をチェックするメソッド
  def check_permission
    unless accessible_by?(current_api_v1_user)
      raise ActiveRecord::RecordNotFound, 'このミッションの権限がありません。'
    end
  end

  # クラスメソッドでN+1を解消
  def self.with_progress(user)
    # 必要なタスク情報を事前ロード
    missions = includes(:tasks).where(deleted_at: nil)

    # 各ミッションごとに進捗率を計算し、データをマージ
    missions.map do |mission|
      {
        id: mission.id,
        name: mission.name,
        user_id: mission.user_id,
        team_id: mission.team_id,
        progress_rate: mission.calculate_progress_rate(mission.tasks),
        created_at: mission.created_at,
        updated_at: mission.updated_at
      }
    end
  end
end

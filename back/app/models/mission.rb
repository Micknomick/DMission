class Mission < ApplicationRecord
  #個人ミッション
  belongs_to :user, optional: true, class_name: "Team"
  #チームミッション
  belongs_to :team, optional: true, class_name: "User"
  # Missionに紐づくタスク（Missionが削除されたらタスクも削除
  has_many :tasks, dependent: :destroy
  # スコープ：個人ミッションとチームミッションを区別
  scope :personal, -> { where.not(user_id: nil).where(team_id: nil) }
  scope :team, -> { where.not(team_id: nil).where(user_id: nil) }

  # 論理削除を有効化
  acts_as_paranoid

  # ダッシュボードの進捗率を計算するメソッド
  def progress_rate
    # 適切な計算ロジックを入れてください。仮に完了タスクの割合を返すとします
    completed_tasks = tasks.where(status: 'completed').count
    total_tasks = tasks.count
    total_tasks.zero? ? 0 : (completed_tasks.to_f / total_tasks * 100).round
  end

  # 進捗率を計算するメソッド
  def calculate_progress_rate
    total_tasks = tasks.count
    return 0 if total_tasks.zero?

    total_progress = tasks.sum(:progress_rate) # tasks テーブルの progress_rate を合計
    (total_progress.to_f / total_tasks).round # 平均進捗率を計算
  end
end

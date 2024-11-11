class Mission < ApplicationRecord
  #個人ミッション
  belongs_to :user, optional: true
  #チームミッション
  belongs_to :team, optional: true
  # Missionに紐づくタスク（Missionが削除されたらタスクも削除
  has_many :tasks, dependent: :destroy
  # スコープ：個人ミッションとチームミッションを区別
  scope :personal, -> { where.not(user_id: nil).where(team_id: nil) }
  scope :team, -> { where.not(team_id: nil).where(user_id: nil) }

  # 進捗率を計算するメソッド
  def progress_rate
    # 適切な計算ロジックを入れてください。仮に完了タスクの割合を返すとします
    completed_tasks = tasks.where(status: 'completed').count
    total_tasks = tasks.count
    total_tasks.zero? ? 0 : (completed_tasks.to_f / total_tasks * 100).round
  end
end

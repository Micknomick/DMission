class Task < ApplicationRecord
  # paranoiaを有効化
  acts_as_paranoid

  # Enum定義
  enum priority: { low: 0, medium: 1, high: 2, urgent: 3 }

  # 関連付け
  belongs_to :user, foreign_key: :created_by_user_id, class_name: "User" # 作成者
  belongs_to :mission, optional: true
  belongs_to :assigned_user, class_name: "User", foreign_key: :assigned_user_id, optional: true
  belongs_to :team, optional: true
  has_many :task_approval_histories, dependent: :destroy # 承認履歴

  # バリデーション
  validates :title, presence: true
  validates :priority, inclusion: { in: priorities.keys }
  validates :progress_rate, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }

  # スコープ
  scope :personal, -> { where(team_id: nil) }
  scope :team, -> { where.not(team_id: nil) }
  scope :upcoming, -> { where("deadline >= ?", Date.today).order(deadline: :asc) } # 締切が近いタスク
  scope :high_priority, -> { where(priority: priorities[:high]).order(created_at: :desc) } # 優先度が高いタスク

  # コールバック
  before_save :set_completed_at

  # 仮想属性: ステータス
  def status
    case progress_rate
    when 0
      "pending"
    when 100
      "completed"
    else
      "in_progress"
    end
  end

  # JSON出力にステータスを含める
  def as_json(options = {})
    super(options).merge(status: status)
  end

  private

  # 完了日時を設定
  def set_completed_at
    self.completed_at = Time.current if progress_rate == 100
  end
end

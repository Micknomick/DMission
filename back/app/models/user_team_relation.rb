class UserTeamRelation < ApplicationRecord
  belongs_to :user
  belongs_to :team

  # 役割のバリデーション（admin, member のみを許可する）
  validates :role, presence: true, inclusion: { in: %w(admin member) }
end

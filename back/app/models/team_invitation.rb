class TeamInvitation < ApplicationRecord
  belongs_to :team
  belongs_to :user

  validates :status, inclusion: { in: %w[pending accepted rejected] }
  validates :token, presence: true, uniqueness: true
end

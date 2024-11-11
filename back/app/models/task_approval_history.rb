class TaskApprovalHistory < ApplicationRecord
  belongs_to :task
  # 承認を行ったユーザー
  belongs_to :approved_by_user, class_name: "User", foreign_key: :approved_by_user_id
end

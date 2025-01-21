class Team < ApplicationRecord
  belongs_to :created_by_user, class_name: 'User', foreign_key: 'created_by_user_id', optional: true
  # UserTeamRelationとの関連を設定
  has_many :user_team_relations, dependent: :destroy

  # Userとの関連を設定。UserTeamRelationを介してUserと多対多の関係になります。
  has_many :users, through: :user_team_relations

  # MissionやTaskとの関連を設定
  has_many :missions, dependent: :destroy
  has_many :tasks, dependent: :destroy

  # 作成者の関連を追加
  belongs_to :creator, class_name: 'User', foreign_key: 'created_by_user_id', optional: false

  # バリデーションを追加
  validates :name, presence: true
  validates :description, presence: true
  validates :created_by_user_id, presence: true # 作成者IDが必須
end

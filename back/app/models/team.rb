class Team < ApplicationRecord
  # UserTeamRelationとの関連を設定
  has_many :user_team_relations, dependent: :destroy

  # Userとの関連を設定。UserTeamRelationを介してUserと多対多の関係になります。
  has_many :users, through: :user_team_relations

  has_many :missions, dependent: :destroy

  has_many :tasks, dependent: :destroy

end

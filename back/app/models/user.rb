class User < ApplicationRecord
        # Devise モジュールを設定
        devise :database_authenticatable, :registerable,
               :recoverable, :rememberable, :validatable

        # DeviseTokenAuth を有効にする
        include DeviseTokenAuth::Concerns::User

        # UserTeamRelationとの関連を設定
        has_many :user_team_relations, dependent: :destroy

        # Teamとの関連を設定。UserTeamRelationを介してTeamと多対多の関係
        has_many :teams, through: :user_team_relations

        # Missionとの関連
        has_many :missions, dependent: :destroy

        # 作成したタスクとの関連
        has_many :tasks, foreign_key: "created_by_user_id", class_name: "Task"

        # 承認されたタスクとの関連
        has_many :assigned_tasks, foreign_key: :approved_by_user_id
      end

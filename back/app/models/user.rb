class User < ApplicationRecord
            # Include default devise modules.
            devise :database_authenticatable, :registerable,
                    :recoverable, :rememberable, :trackable, :validatable,
                    :confirmable, :omniauthable
            include DeviseTokenAuth::Concerns::User
  # UserTeamRelationとの関連を設定
  has_many :user_team_relations, dependent: :destroy

  # Teamとの関連を設定。UserTeamRelationを介してTeamと多対多の関係
  has_many :teams, through: :user_team_relations

  has_many :missions, dependent: :destroy

  has_many :tasks, foreign_key: "created_by_user_id", class_name: "Task"

  has_many :assigned_tasks, foreign_key: :approved_by_user_id
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
end

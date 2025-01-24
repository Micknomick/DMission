module Api
  module V1
    class TeamsController < ApplicationController
      before_action :authenticate_api_v1_user!

      # チーム一覧を取得
      def index
        teams = current_api_v1_user.teams.includes(:created_by_user)
        render json: teams.map { |team| team.as_json.merge(created_by_user_name: team.created_by_user&.name) }, status: :ok
      end

      def show
        begin
          team = current_api_v1_user.teams.find(params[:id]) # チームを検索

          # チームメンバーのIDを取得
          member_ids = team.users.pluck(:id)

          # チームに所属していないユーザーを取得
          users_not_in_team = User.where.not(id: member_ids).select(:id, :name, :email)

          # レスポンスを構築
          render json: {
            id: team.id,
            name: team.name,
            description: team.description,
            created_by_user_id: team.created_by_user_id,
            members: team.users.select(:id, :name, :email), # チームメンバー情報
            users_not_in_team: users_not_in_team, # チームに所属していないユーザー
            missions: team.missions.includes(:tasks).map do |mission|
              {
                id: mission.id,
                name: mission.name,
                description: mission.description,
                deadline: mission.deadline,
                tasks: mission.tasks.select(:id, :title, :progress_rate) # タスク情報
              }
            end
          }, status: :ok
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Team not found' }, status: :not_found
        rescue => e
          Rails.logger.error "Unexpected error in TeamsController#show: #{e.message}"
          render json: { error: 'Internal Server Error' }, status: :internal_server_error
        end
      end

      # チームを作成
      def create
        team = Team.new(team_params.merge(created_by_user_id: current_api_v1_user.id)) # 作成者IDを直接マージ
        if team.save
          UserTeamRelation.create!(
            user_id: current_api_v1_user.id,
            team_id: team.id,
            role: "admin"
          )
          render json: team, status: :created
        else
          render json: { errors: team.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # ユーザーが所属するチーム一覧を取得
      def my_teams
        teams = current_api_v1_user.teams # ログインユーザーが所属しているチームを取得
        render json: teams, status: :ok
      end

      # チームに招待
      def invite
        # `params[:id]` を使用してチームを取得（ルート定義に基づく）
        team = current_api_v1_user.teams.find_by(id: params[:id])
        unless team
          return render json: { error: 'Team not found or you do not have permission to invite members to this team' }, status: :not_found
        end

        # 招待するユーザーを取得
        user = User.find_by(id: params[:user_id])
        unless user
          return render json: { error: 'User not found' }, status: :not_found
        end

        # ユーザーが既にチームメンバーであるかチェック
        if team.users.include?(user)
          return render json: { error: "#{user.name} is already a member of this team" }, status: :unprocessable_entity
        end

        # 招待がすでに存在しているかチェック
        if TeamInvitation.exists?(team: team, user: user)
          return render json: { error: 'This user is already invited to the team' }, status: :unprocessable_entity
        end

        # 招待を作成
        invitation = TeamInvitation.create!(
          team: team,
          user: user,
          token: SecureRandom.hex(16),
          status: 'pending'
        )

        render json: { message: "Invitation sent to #{user.email}", invitation: invitation }, status: :ok
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.message }, status: :unprocessable_entity
      rescue => e
        Rails.logger.error "Unexpected error in TeamsController#invite: #{e.message}"
        render json: { error: 'Internal Server Error' }, status: :internal_server_error
      end


      private

      def team_params
        params.require(:team).permit(:name, :description)
      end
    end
  end
end

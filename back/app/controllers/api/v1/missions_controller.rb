module Api
  module V1
    class MissionsController < ApplicationController
      before_action :authenticate_api_v1_user!
      before_action :set_mission, only: [:show, :update, :destroy]
      before_action :check_permission, only: [:update, :destroy]

      rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

      # ミッション一覧
      def index
        tab = params[:tab] || 'Progress'

        personal_missions = filter_missions(current_api_v1_user.missions.personal, tab)
        team_ids = current_api_v1_user.teams.pluck(:id)
        team_missions = filter_missions(Mission.joins(:team).where(teams: { id: team_ids }), tab)

        render json: {
          personal_missions: personal_missions.as_json(only: [:id, :name, :description, :deadline, :is_completed, :progress, :deleted_at]),
          team_missions: team_missions.as_json(only: [:id, :name, :description, :deadline, :is_completed, :progress, :deleted_at])
        }, status: :ok
      end

      # ミッション詳細
      def show
        render json: @mission.as_json(only: [:id, :name, :description, :deadline, :is_completed, :progress]), status: :ok
      end

      # ミッション作成
      def create
        if params[:team_id].present?
          begin
            team = Team.find(params[:team_id])
            @mission = team.missions.build(mission_params.merge(user: current_api_v1_user))
          rescue ActiveRecord::RecordNotFound
            render json: { errors: ['指定されたチームが存在しません。'] }, status: :not_found
            return
          end
        else
          @mission = current_api_v1_user.missions.build(mission_params)
        end

        if @mission.save
          render json: @mission.as_json(only: [:id, :name, :description, :deadline, :is_completed, :progress]), status: :created
        else
          render json: { errors: @mission.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # ミッション更新
      def update
        if @mission.update(mission_params)
          render json: @mission.as_json(only: [:id, :name, :description, :deadline, :is_completed, :progress]), status: :ok
        else
          render json: { errors: @mission.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # ミッション削除（論理削除）
      def destroy
        if @mission.deleted_at.nil?
          # 論理削除
          @mission.update(deleted_at: Time.current)
          render json: { message: 'ミッションが論理削除されました。' }, status: :ok
        else
          # 完全削除
          @mission.destroy
          render json: { message: 'ミッションが完全に削除されました。' }, status: :ok
        end
      end

      private

      # ミッションをタブに応じてフィルタリング
      def filter_missions(missions, tab)
        case tab
        when 'Progress'
          missions.where('progress < 100').where(deleted_at: nil)
        when 'Done'
          missions.where(progress: 100).where(deleted_at: nil)
        when 'Deleted'
          missions.where.not(deleted_at: nil)
        else
          missions
        end
      end

      def set_mission
        @mission = Mission.find(params[:id])
      end

      def check_permission
        render json: { message: 'このミッションの権限がありません。' }, status: :forbidden unless @mission.accessible_by?(current_api_v1_user)
      end

      def mission_params
        params.require(:mission).permit(:name, :description, :is_completed, :deadline, :progress)
      end

      def render_not_found
        render json: { message: 'リソースが見つかりません。' }, status: :not_found
      end
    end
  end
end

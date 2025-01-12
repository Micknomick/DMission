module Api
  module V1
    class MissionsController < ApplicationController
      before_action :authenticate_api_v1_user!
      before_action :set_mission, only: [:show, :update, :destroy]
      before_action :check_permission, only: [:update, :destroy]

      rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

      # ミッション一覧
      def index
        personal_missions = current_api_v1_user.missions.personal
        team_missions = Mission.joins(:team).where(team: { id: current_api_v1_user.team_ids })

        render json: {
          personal_missions: personal_missions.as_json(only: [:id, :name, :description, :deadline, :is_completed]),
          team_missions: team_missions.as_json(only: [:id, :name, :description, :deadline, :is_completed])
        }, status: :ok
      end

      # ミッション詳細
      def show
        render json: @mission.as_json(only: [:id, :name, :description, :deadline, :is_completed]), status: :ok
      end

      # ミッション作成
      def create
        Rails.logger.debug "Params received: #{params.inspect}"
        Rails.logger.debug "Current user: #{current_api_v1_user.inspect}"

        if params[:team_id].present?
          begin
            team = Team.find(params[:team_id])
            @mission = team.missions.build(mission_params.merge(user: current_api_v1_user))
          rescue ActiveRecord::RecordNotFound
            Rails.logger.error "Team not found: #{params[:team_id]}"
            render json: { errors: ['指定されたチームが存在しません。'] }, status: :not_found
            return
          end
        else
          @mission = current_api_v1_user.missions.build(mission_params)
        end

        if @mission.save
          render json: @mission.as_json(only: [:id, :name, :description, :deadline, :is_completed]), status: :created
        else
          Rails.logger.error "Mission validation failed: #{@mission.errors.full_messages}"
          render json: { errors: @mission.errors.full_messages }, status: :unprocessable_entity
        end
      rescue => e
        Rails.logger.error "Unexpected error in create: #{e.message}"
        render json: { errors: ['予期せぬエラーが発生しました。'] }, status: :internal_server_error
      end

      # ミッション更新
      def update
        if @mission.update(mission_params)
          render json: @mission.as_json(only: [:id, :name, :description, :deadline, :is_completed]), status: :ok
        else
          render json: { errors: @mission.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # ミッション削除
      def destroy
        @mission.destroy
        render json: { message: 'ミッションが削除されました。' }, status: :ok
      end

      private

      def set_mission
        @mission = Mission.find(params[:id])
      end

      def check_permission
        render json: { message: 'このミッションの権限がありません。' }, status: :forbidden unless @mission.accessible_by?(current_api_v1_user)
      end

      def mission_params
        params.require(:mission).permit(:name, :description, :is_completed, :deadline)
      end

      def render_not_found
        render json: { message: 'リソースが見つかりません。' }, status: :not_found
      end
    end
  end
end

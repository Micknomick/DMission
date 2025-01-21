module Api
  module V1
    class MissionsController < ApplicationController
      before_action :authenticate_api_v1_user!
      before_action :set_mission, only: [:show, :update, :destroy]
      before_action :check_permission, only: [:update, :destroy]

      rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

      # ミッション一覧
      def index
        personal_missions = current_api_v1_user.missions.personal.includes(:tasks).where(deleted_at: nil)
        team_ids = current_api_v1_user.teams.pluck(:id)
        team_missions = Mission.joins(:team).where(teams: { id: team_ids }).includes(:tasks).where(deleted_at: nil)

        render json: {
          personal_missions: personal_missions.map { |mission| serialize_mission_with_progress(mission) },
          team_missions: team_missions.map { |mission| serialize_mission_with_progress(mission) }
        }, status: :ok
      end

      # ミッション詳細
      def show
        tasks = @mission.tasks.includes(:user) # 関連タスクとユーザー情報をロード
        render json: {
          mission: serialize_mission_with_progress(@mission),
          tasks: tasks.as_json(
            only: [:id, :title, :description, :progress_rate, :priority, :start_date, :reminder_at, :recurring, :created_at, :updated_at],
            include: { user: { only: [:id, :name, :email] } } # タスク作成者情報を含む
          )
        }, status: :ok
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
          render json: serialize_mission_with_progress(@mission), status: :created
        else
          render json: { errors: @mission.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # ミッション更新
      def update
        if @mission.update(mission_params)
          render json: serialize_mission_with_progress(@mission), status: :ok
        else
          render json: { errors: @mission.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # ミッション削除（
      def destroy
        if @mission.destroy
          render json: { message: 'ミッションが完全に削除されました。' }, status: :ok
        else
          render json: { message: 'ミッションの削除に失敗しました。' }, status: :unprocessable_entity
        end
      end


      private

      def set_mission
        @mission = Mission.find(params[:id])
      end

      def check_permission
        render json: { message: 'このミッションの権限がありません。' }, status: :forbidden unless @mission.accessible_by?(current_api_v1_user)
      end

      def mission_params
        params.require(:mission).permit(:name, :description, :is_completed, :deadline, :team_id)
      end

      def render_not_found
        render json: { message: 'リソースが見つかりません。' }, status: :not_found
      end

      # 修正: progress_rate を含めたミッションのシリアライズメソッド
      def serialize_mission_with_progress(mission)
        {
          id: mission.id,
          name: mission.name,
          description: mission.description,
          deadline: mission.deadline,
          is_completed: mission.is_completed,
          progress_rate: mission.calculate_progress_rate, # サーバー側で進捗率を計算
          deleted_at: mission.deleted_at
        }
      end
    end
  end
end

# app/controllers/missions_controller.rb
class MissionsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_mission, only: [:show, :edit, :update, :destroy]
  before_action :check_permission, only: [:edit, :update, :destroy]

  # ミッション一覧（個人ミッションとチームミッション）
  def index
    @personal_missions = current_user.missions.personal
    @team_missions = current_user.teams.flat_map(&:missions)
  end

  # ミッション詳細表示
  def show
  end

  # 新規ミッション作成フォーム
  def new
    @mission = Mission.new
  end

  # ミッションの作成
  def create
    if params[:team_id].present?  # チームに紐づくミッション
      team = Team.find(params[:team_id])
      @mission = team.missions.build(mission_params)
      @mission.user = current_user  # 作成者を設定
    else  # 個人ミッション
      @mission = current_user.missions.build(mission_params)
    end

    if @mission.save
      redirect_to missions_path, notice: 'ミッションが作成されました。'
    else
      render :new
    end
  end

  # ミッション編集フォーム
  def edit
    @mission = Mission.find(params[:id])
  end

  # ミッションの更新
  def update
    @mission = Mission.find(params[:id])
    if @mission.update(mission_params)
      redirect_to missions_path, notice: 'ミッションが更新されました。'
    else
      render :edit, alert: '更新に失敗しました。'
    end
  end

  # ミッションの削除
  def destroy
    @mission.destroy
    redirect_to missions_path, notice: 'ミッションが削除されました。'
  end

  private

  # 特定のミッションを取得
  def set_mission
    @mission = Mission.find(params[:id])
  end

  # ユーザーがミッションにアクセス可能かを確認
  def check_permission
    unless @mission.user == current_user || (@mission.team && @mission.team.users.include?(current_user))
      redirect_to missions_path, alert: 'このミッションの権限がありません。'
    end
  end

  # ミッションのパラメータを許可
  def mission_params
    params.require(:mission).permit(:name, :description, :is_completed, :deadline)
  end
end

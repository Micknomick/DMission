class Api::V1::TasksController < ApplicationController
  before_action :authenticate_api_v1_user!
  before_action :set_task, only: [:show, :update, :destroy]

  alias_method :current_user, :current_api_v1_user

  # タスク一覧
  def index
    @tasks = current_user.tasks.includes(:mission, :user, :assigned_user).order(priority: :desc, deadline: :asc)

    if params[:filter].present?
      @tasks = apply_filters(@tasks, params[:filter])
    end

    render json: @tasks, include: task_includes, status: :ok
  end

  # タスク詳細
  def show
    Rails.logger.info "リクエストのパラメータ: #{params.inspect}"
    Rails.logger.info "現在のユーザー: #{current_user.inspect}"
    if @task.present?
      render json: @task, include: task_includes, status: :ok
    else
      render json: { error: "タスクが見つかりません。" }, status: :not_found
    end
  end

  # タスク作成
  def create
    @task = current_user.tasks.new(task_params)
    if @task.save
      update_mission_progress(@task.mission) # ミッションの進捗率を再計算
      render json: @task, include: task_includes, status: :created
    else
      render_error(@task.errors.full_messages)
    end
  end

  # タスク更新
  def update
    if @task.update(task_params)
      update_mission_progress(@task.mission) # ミッションの進捗率を再計算
      render json: @task, include: task_includes, status: :ok
    else
      render_error(@task.errors.full_messages)
    end
  end

  # タスク削除
  def destroy
    mission = @task.mission # 削除前に関連するミッションを取得
    @task.destroy
    update_mission_progress(mission) # ミッションの進捗率を再計算
    render json: { message: 'タスクが削除されました。' }, status: :ok
  end

  private

  # タスクを取得
  def set_task
    @task = current_user.tasks.find(params[:id])
  end

  # タスク作成・更新時のパラメータ
  def task_params
    params.require(:task).permit(
      :title, :description, :mission_id, :assigned_user_id, :priority,
      :progress_rate, :deadline, :start_date, :completed_at, :recurring, :reminder_at,:created_at,:updated_at
    )
  end

  # JSONレスポンスに含める関連データ
  def task_includes
    {
      mission: { only: :name },
      user: { only: [:id, :name, :email] },
      assigned_user: { only: [:id, :name] }
    }
  end

  # ミッション進捗率の更新
  def update_mission_progress(mission)
    return unless mission

    mission.update(progress: mission.calculate_progress_rate) # ミッションの進捗率を再計算
  end

  # エラー応答のフォーマット
  def render_error(errors, status = :unprocessable_entity)
    render json: { errors: errors }, status: status
  end

  # フィルターの適用
  def apply_filters(tasks, filters)
    filters.each do |key, value|
      case key
      when 'priority'
        tasks = tasks.where(priority: value)
      when 'upcoming'
        tasks = tasks.where("deadline >= ?", Date.today)
      when 'assigned_user_id'
        tasks = tasks.where(assigned_user_id: value)
      end
    end
    tasks
  end
end

# app/controllers/tasks_controller.rb
class TasksController < ApplicationController
  before_action :set_task, only: [:show, :edit, :update, :destroy]

  def show
    @task = Task.find(params[:id])
  end

  # タスク一覧
  # タスク一覧の表示
  def index
    @tasks = current_user.tasks.includes(:mission, :created_by_user).order(created_at: :desc)
    @missions = Mission.where(user_id: current_user.id).or(Mission.where(team_id: current_user.teams.pluck(:id)))
  end

  # 新規タスクの作成
  def create
    @task = Task.new(task_params)
    @task.created_by_user_id = current_user.id
    if @task.save
      redirect_to dashboard_path, notice: 'タスクが作成されました。'
    else
      Rails.logger.error("タスクの作成に失敗しました: #{@task.errors.full_messages}")
      redirect_to dashboard_path, alert: 'タスクの作成に失敗しました。'
    end
  end

  # タスク編集
  def edit
    @task = Task.find(params[:id])
    @missions = Mission.where(user_id: current_user.id).or(Mission.where(team_id: current_user.teams.pluck(:id)))
  end

  # タスクの更新
  def update
    if @task.update(task_params)
      redirect_to tasks_path, notice: 'タスクが更新されました。'
    else
      redirect_to :edit, alert: 'タスクの更新に失敗しました。'
    end
  end

  # タスク詳細表示
  def show
  end

  # タスクの削除
  def destroy
    @task.destroy
    redirect_to dashboard_path, notice: 'タスクが削除されました。'
  end

  private

  def set_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:title, :description, :mission_id, :created_by_user_id, :assigned_user_id, :team_id, :progress_rate, :status, :deadline)
  end
end

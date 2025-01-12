module Api
  module V1
    class TasksController < ApplicationController
      before_action :authenticate_user!
      before_action :set_task, only: [:show, :update, :destroy]

      # タスク一覧
      def index
        @tasks = current_user.tasks.includes(:mission, :created_by_user).order(created_at: :desc)
        render json: @tasks, include: { mission: { only: :name }, created_by_user: { only: :name } }
      end

      # タスク詳細
      def show
        render json: @task, include: { mission: { only: :name }, created_by_user: { only: :name } }
      end

      # タスク作成
      def create
        @task = current_user.tasks.new(task_params)
        if @task.save
          render json: @task, status: :created
        else
          render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # タスク更新
      def update
        if @task.update(task_params)
          render json: @task, status: :ok
        else
          render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # タスク削除
      def destroy
        @task.destroy
        render json: { message: 'タスクが削除されました。' }, status: :ok
      end

      private

      def set_task
        @task = current_user.tasks.find(params[:id])
      end

      def task_params
        params.require(:task).permit(:title, :description, :mission_id, :assigned_user_id, :progress_rate, :status, :deadline)
      end
    end
  end
end

class DashboardController < ApplicationController
  before_action :authenticate_user!

  def show
    @user = current_user

    # 個人タスクとチームタスクを取得
    @personal_tasks = @user.tasks.personal
    @team_tasks = Task.where(team_id: @user.teams.select(:id)) # チームタスク

    # 全てのタスクを@tasksにまとめる（ActiveRecord::Relationとして）
    @tasks = @personal_tasks.or(@team_tasks)

    # ミッション情報（個人ミッションとチームミッション）
    @personal_missions = @user.missions.personal
    @team_missions = Mission.where(team_id: @user.teams.select(:id))

    # 全てのミッションを@missionsにまとめる（ActiveRecord::Relationとして）
    @missions = @personal_missions.or(@team_missions)

    # タスクの進捗率サマリー
    @completed_tasks_count = @tasks.where(progress_rate: 100).count
    @total_tasks_count = @tasks.count

    # チーム、ミッション、タスクの数を取得
    @team_count = current_user.teams.count
    @mission_count = @missions.count
    @task_count = @tasks.count
  end
end

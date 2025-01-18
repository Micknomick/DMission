class AddDetailsToTasks < ActiveRecord::Migration[7.0]
  def change
    # 優先度を表すカラム
    add_column :tasks, :priority, :integer, default: 0, null: false

    # タスク開始予定日
    add_column :tasks, :start_date, :date

    # タスク完了日時
    add_column :tasks, :completed_at, :datetime

    # リマインダー通知日時
    add_column :tasks, :reminder_at, :datetime

    # 繰り返しタスクのフラグ
    add_column :tasks, :recurring, :boolean, default: false, null: false

    # タスクを最後に更新したユーザー
    add_column :tasks, :updated_by_user_id, :bigint

    # インデックス追加
    add_index :tasks, :priority
    add_index :tasks, :start_date
    add_index :tasks, :completed_at
  end
end

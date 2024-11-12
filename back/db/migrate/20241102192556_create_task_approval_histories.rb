class CreateTaskApprovalHistories < ActiveRecord::Migration[7.0]
  def change
    create_table :task_approval_histories do |t|
      t.references :task, null: false, foreign_key: true
      t.integer :approved_by_user_id
      t.string :action
      t.datetime :action_at
      t.text :comment

      t.timestamps
    end
  end
end

class CreateTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :tasks do |t|
      t.string :title, null: false
      t.text :description
      t.references :mission, null: false, foreign_key: true
      t.integer :created_by_user_id
      t.integer :assigned_user_id
      t.integer :team_id
      t.integer :progress_rate
      t.string :status

      t.timestamps
    end
  end
end

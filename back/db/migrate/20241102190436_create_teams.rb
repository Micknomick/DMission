class CreateTeams < ActiveRecord::Migration[7.0]
  def change
    create_table :teams do |t|
      t.string :name
      t.text :description
      t.integer :created_by_user_id

      t.timestamps
    end
  end
end

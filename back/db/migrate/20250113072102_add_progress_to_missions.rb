class AddProgressToMissions < ActiveRecord::Migration[7.0]
  def change
    add_column :missions, :progress, :integer, default: 0, null: false
  end
end

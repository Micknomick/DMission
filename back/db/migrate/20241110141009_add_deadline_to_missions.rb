class AddDeadlineToMissions < ActiveRecord::Migration[7.0]
  def change
    add_column :missions, :deadline, :date
  end
end

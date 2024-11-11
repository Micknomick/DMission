# db/migrate/xxxxxx_change_team_id_to_be_nullable_in_missions.rb
class ChangeTeamIdToBeNullableInMissions < ActiveRecord::Migration[7.0]
  def change
    change_column_null :missions, :team_id, true
  end
end

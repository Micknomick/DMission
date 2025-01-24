class CreateTeamInvitations < ActiveRecord::Migration[7.0]
  def change
    create_table :team_invitations do |t|
      t.references :team, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :status, default: 'pending'
      t.string :token, null: false, unique: true

      t.timestamps
    end
  end
end

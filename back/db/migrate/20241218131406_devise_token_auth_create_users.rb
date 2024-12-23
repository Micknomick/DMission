class DeviseTokenAuthCreateUsers < ActiveRecord::Migration[7.0]
  def change
    change_table(:users, bulk: true) do |t|
      ## Required
      t.string :provider, null: false, default: "email" unless column_exists?(:users, :provider)
      t.string :uid, null: false, default: "" unless column_exists?(:users, :uid)

      ## Database authenticatable
      t.string :encrypted_password, null: false, default: "" unless column_exists?(:users, :encrypted_password)

      ## Recoverable
      t.string :reset_password_token unless column_exists?(:users, :reset_password_token)
      t.datetime :reset_password_sent_at unless column_exists?(:users, :reset_password_sent_at)
      t.boolean :allow_password_change, default: false unless column_exists?(:users, :allow_password_change)

      ## Rememberable
      t.datetime :remember_created_at unless column_exists?(:users, :remember_created_at)

      ## Confirmable
      t.string :confirmation_token unless column_exists?(:users, :confirmation_token)
      t.datetime :confirmed_at unless column_exists?(:users, :confirmed_at)
      t.datetime :confirmation_sent_at unless column_exists?(:users, :confirmation_sent_at)
      t.string :unconfirmed_email unless column_exists?(:users, :unconfirmed_email) # Only if using reconfirmable

      ## User Info
      t.string :name unless column_exists?(:users, :name)
      t.string :nickname unless column_exists?(:users, :nickname)
      t.string :image unless column_exists?(:users, :image)

      ## Tokens
      t.json :tokens unless column_exists?(:users, :tokens)
    end

    add_index :users, :email, unique: true unless index_exists?(:users, :email)
    add_index :users, [:uid, :provider], unique: true unless index_exists?(:users, [:uid, :provider])
    add_index :users, :reset_password_token, unique: true unless index_exists?(:users, :reset_password_token)
    add_index :users, :confirmation_token, unique: true unless index_exists?(:users, :confirmation_token)
  end
end

class AddRecoverableToUsers < ActiveRecord::Migration[7.0]
  def change
    # すでにカラムが存在する場合は追加しない
    unless column_exists?(:users, :reset_password_token)
      add_column :users, :reset_password_token, :string
    end

    unless column_exists?(:users, :reset_password_sent_at)
      add_column :users, :reset_password_sent_at, :datetime
    end

    # allow_password_changeカラムは既に存在しているので追加しない

    # インデックスが存在しない場合のみ追加
    unless index_exists?(:users, :reset_password_token)
      add_index :users, :reset_password_token, unique: true
    end
  end
end

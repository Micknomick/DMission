require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { build(:user) }

  describe 'バリデーション' do
    it '有効なファクトリを持つこと' do
      expect(user).to be_valid
    end

    it '名前がない場合は無効であること' do
      user.name = nil
      expect(user).to be_invalid
      expect(user.errors[:name]).to include("can't be blank")
    end

    it 'メールアドレスがない場合は無効であること' do
      user.email = nil
      expect(user).to be_invalid
      expect(user.errors[:email]).to include("can't be blank")
    end

    it '重複したメールアドレスは無効であること' do
      existing_user = create(:user) # FactoryBot で一意のメールアドレスを生成
      user.email = existing_user.email # 同じメールアドレスを設定
      expect(user).to be_invalid
      expect(user.errors[:email]).to include("has already been taken")
    end
  end

  describe 'デフォルト値' do
    it 'providerのデフォルト値が"email"であること' do
      expect(user.provider).to eq 'email'
    end

    it 'uidがemailで自動設定されること' do
      user.email = Faker::Internet.unique.email # Faker で一意のメールアドレスを生成
      user.save
      expect(user.uid).to eq user.email
    end
  end

  describe 'メソッド' do
    it 'パスワードを変更できること' do
      user.save
      new_password = 'new_password'
      user.update(password: new_password, password_confirmation: new_password)
      expect(user.valid_password?(new_password)).to be true
    end
  end
end

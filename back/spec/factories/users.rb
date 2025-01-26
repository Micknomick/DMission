FactoryBot.define do
  factory :user do
    name { "テストユーザー" } # 任意のデフォルト値
    email { Faker::Internet.unique.email }
    password { "password" }
    password_confirmation { "password" }
    provider { "email" }
    uid { email } # DeviseTokenAuth のデフォルト仕様に基づき email を uid に設定
  end
end

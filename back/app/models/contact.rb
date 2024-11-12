class Contact < MailForm::Base
  attribute :first_name,  validate: true
  attribute :last_name,   validate: true
  attribute :email,       validate: /\A[^@\s]+@[^@\s]+\z/
  attribute :message,     validate: true
  attribute :nickname,    captcha: true  # スパム対策

  def headers
    {
      subject: "お問い合わせ",
      to: "ronaldo7.mt29@gmail.com",  # 送信先メールアドレス
      from: %("#{first_name} #{last_name}" <#{email}>)
    }
  end
end

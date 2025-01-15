module Api
  module V1
    class ContactsController < ApplicationController
      def create
        Rails.logger.info "Received params: #{params.inspect}" # リクエストパラメータをログに記録
        contact = Contact.new(contact_params)
        if contact.save
          Rails.logger.info "Contact created successfully: #{contact.inspect}" # 成功時のログ
          render json: { message: "お問い合わせ内容を受け付けました。" }, status: :created
        else
          Rails.logger.error "Validation errors: #{contact.errors.full_messages.join(", ")}" # エラー時のログ
          render json: { errors: contact.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def contact_params
        params.require(:contact).permit(:name, :email, :message)
      end
    end
  end
end

module Api
  module V1
    class Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
      protected

      # サインアップ時に許可するパラメータ
      def sign_up_params
        params.require(:registration).permit(:name, :email, :password, :password_confirmation)
      end

      # アカウント更新時に許可するパラメータ
      def account_update_params
        params.permit(:name, :email, :password, :password_confirmation, :current_password)
      end
    end
  end
end

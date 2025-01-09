class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  # skip_before_action :verify_authenticity_token, if: :devise_controller?
  # helper_method :current_user, :user_signed_in?
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  #   devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end
end

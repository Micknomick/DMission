module Api
  module V1
    module Auth
      class PasswordsController < DeviseTokenAuth::PasswordsController
        # passwordが含まれるため削除
        wrap_parameters false
        # パスワードリセットメール送信
        def create
          return render_create_error_missing_email unless resource_params[:email]

          @email = get_case_insensitive_field_from_resource_params(:email)
          @resource = find_resource(:uid, @email)

          if @resource
            yield @resource if block_given?
            @resource.send_reset_password_instructions(
              email: @email,
              provider: 'email',
              redirect_url: params[:redirect_url]
            )

            if @resource.errors.empty?
              render_create_success
            else
              render_create_error @resource.errors
            end
          else
            render_not_found_error
          end
        end

        # パスワードリセット実行
        def update
          @resource = resource_class.reset_password_by_token(
            reset_password_token: resource_params[:reset_password_token],
            password: resource_params[:password],
            password_confirmation: resource_params[:password_confirmation]
          )

          if @resource.errors.empty?
            render_update_success
          else
            render_update_error @resource.errors
          end
        end

        private

        def resource_params
          case action_name
          when 'create'
            params.permit(:email, :redirect_url)
          when 'update'
            params.permit(:reset_password_token, :password, :password_confirmation)
          else
            {}
          end
        end

        def render_create_success
          render json: {
            success: true,
            message: I18n.t('devise_token_auth.passwords.sended', email: @email)
          }
        end

        def render_not_found_error
          render json: {
            success: false,
            errors: [I18n.t('devise_token_auth.passwords.user_not_found', email: @email)]
          }, status: 404
        end

        def render_update_success
          render json: {
            success: true,
            message: I18n.t('devise_token_auth.passwords.successfully_updated')
          }
        end


      end
    end
  end
end

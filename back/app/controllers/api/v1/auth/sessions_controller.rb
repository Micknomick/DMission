module Api
  module V1
    module Auth
      class SessionsController < DeviseTokenAuth::SessionsController

        def create
          user = User.find_by(email: params[:email])
          if user&.valid_password?(params[:password])
            token = user.create_new_auth_token

            Rails.logger.info "Generated Token: #{token}"
            # トークンをレスポンスヘッダーに設定
            response.headers.merge!(token)

            response_data = {
              id: user.id,
              email: user.email,
              name: user.name,
            }

            Rails.logger.info "Response Data: #{response_data.to_json}"
            render json: { success: true, data: response_data }, status: :ok
          else
            render json: { success: false, error: 'Invalid email or password' }, status: :unauthorized
          end
        end

        def destroy
          client = request.headers['client']
          uid = request.headers['uid']
          token = request.headers['access-token']

          user = User.find_by(uid: uid)

          if user && user.tokens[client] && BCrypt::Password.new(user.tokens[client]['token']) == token
            user.tokens.delete(client)
            if user.save
              render json: { success: true, message: 'Successfully logged out' }, status: :ok
            else
              render json: { success: false, error: 'Failed to log out' }, status: :unprocessable_entity
            end
          else
            render json: { success: false, error: 'Invalid token or user' }, status: :unauthorized
          end
        rescue => e
          Rails.logger.error "Logout Error: #{e.message}"
          render json: { success: false, error: 'An unexpected error occurred' }, status: :internal_server_error
        end
      end
    end
  end
end

module Api
  module V1
    class TeamsController < ApplicationController
      before_action :authenticate_api_v1_user!
      def index
        teams = current_api_v1_user.teams
        render json: teams, status: :ok
      end
    end
  end
end

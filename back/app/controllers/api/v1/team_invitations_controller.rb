module Api
  module V1
    class TeamInvitationsController < ApplicationController
      before_action :authenticate_api_v1_user!
      before_action :set_invitation, only: %i[accept reject]

      #  招待状況の確認
      def index
        invitations = current_api_v1_user.team_invitations.includes(:team).where(status: 'pending')
        render json: invitations.as_json(include: { team: { only: [:id, :name] } }), status: :ok
      end

      # 招待を承認
      def accept
        if @invitation.status == 'pending'
          @invitation.update!(status: 'accepted')
          UserTeamRelation.create!(user: @invitation.user, team: @invitation.team, role: 'member')
          render json: { message: 'You have successfully joined the team!' }, status: :ok
        else
          render json: { error: 'This invitation is no longer valid' }, status: :unprocessable_entity
        end
      end

      # 招待を拒否
      def reject
        if @invitation.status == 'pending'
          @invitation.update!(status: 'rejected')
          render json: { message: 'You have declined the invitation.' }, status: :ok
        else
          render json: { error: 'This invitation is no longer valid' }, status: :unprocessable_entity
        end
      end

      private

      def set_invitation
        Rails.logger.info "Looking for invitation with ID: #{params[:id]} for user ID: #{current_api_v1_user.id}"

        @invitation = TeamInvitation.find_by!(id: params[:id], user: current_api_v1_user) # IDで検索

      rescue ActiveRecord::RecordNotFound
        Rails.logger.error "No invitation found with ID: #{params[:id]} for user ID: #{current_api_v1_user.id}"
        render json: { error: 'Invitation not found' }, status: :not_found
      end
    end
  end
end

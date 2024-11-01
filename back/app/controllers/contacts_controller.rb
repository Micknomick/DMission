class ContactsController < ApplicationController
  def new
    @contact = Contact.new
  end

  def create
    @contact = Contact.new(contact_params)
    if @contact.deliver
      flash[:notice] = "お問い合わせが送信されました。"
      redirect_to new_contact_path
    else
      flash.now[:alert] = "送信に失敗しました。もう一度お試しください。"
      render :new
    end
  end

  private

  def contact_params
    params.require(:contact).permit(:first_name, :last_name, :email, :message, :nickname)
  end
end

class MessagesController < ApplicationController
  #load_and_authorize_resource
  
  def index
    new_messages = User.find(params[:user_id]).messages.where(:viewed => false).count
    respond_to do |format|
      format.html
      format.json { render json: {new_messages: new_messages}}
    end
  end
  
  def create
    if params[:dialogue_id]
      dialogue = Dialogue.find params[:dialogue_id]
    else
      Dialogue.all.each do |d|
        if d.users.to_a == [current_user, User.find(params[:receiver_id])] or d.users.to_a == [User.find(params[:receiver_id]), current_user]
          dialogue = d
        end
      end
    end
    dialogue ||= Dialogue.create_chat(current_user, User.find(params[:receiver_id]))
    message = current_user.send_message(dialogue, params[:message])
    respond_to do |format|
      format.html
      format.json { render json: {content: message, user_name: current_user.first_name + " " + current_user.last_name, user_pic: current_user.avatar_url}}
    end
  end
  
  def destroy
    Message.find(params[:id]).destroy
    respond_to do |format|
      format.html
      format.json {head :no_content}
    end
  end
end

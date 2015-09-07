class DialoguesController < ApplicationController
  #load_and_authorize_resource
  
  def index
    dialogues = Array.new
    User.find(params[:user_id]).dialogues.each do |dialogue| 
      last_message = dialogue.messages.where(:user_id => params[:user_id]).last
      item = {dialogue: dialogue, users: dialogue.users}
      if last_message
        sender = User.find last_message.sender_id
        item[:last_message] = {content: last_message, user_name: sender.first_name + " " + sender.last_name, user_pic: sender.avatar_url}
      end
      dialogues << item
    end
    respond_to do |format|
      format.html
      format.json { render json: dialogues}
    end
  end
  
  def show
    dialogue_messages = Dialogue.find(params[:id]).messages.where(:user_id => params[:user_id])
    dialogue_messages.each do |message|
      message.viewed = true
      message.save!
    end
    messages = User.add_names_pics_messages dialogue_messages
    respond_to do |format|
      format.html
      format.json { render json: messages}
    end
  end
  
  def destroy
    Message.where(:dialogue_id => params[:id], :user_id => params[:user_id]).destroy_all
    respond_to do |format|
      format.html
      format.json {head :no_content}
    end
  end
end

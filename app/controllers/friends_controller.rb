class FriendsController < ApplicationController
  
  def index
    @user = User.find(params[:user_id])
    @friends = @user.friends
    @subscribers = @user.subscribers
    @new_subscribers = Array.new
    @subscribers.each do |subscriber| 
      if !subscriber.subscriptions.find_by(leader_id: @user.id).viewed
        @new_subscribers.push(subscriber)
      end
    end
    @subscribtions = @user.leaders
    @page = params[:page]
    respond_to do |format|
      format.html
      format.json { render json: {friends: @friends, subscribers: @subscribers, new_subscribers: @new_subscribers, subscriptions: @subscribtions}}
    end
  end
end

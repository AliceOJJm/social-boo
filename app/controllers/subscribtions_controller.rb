class SubscribtionsController < ApplicationController
  
  def create
    current_user.subscribe! User.find(params[:subscriber_id])
    render :nothing => true
  end
  
  def destroy
    current_user.unsubscribe! User.find(params[:id])
    render :nothing => true
  end
  
  def edit
    @subscribtion = Subscription.find_by(:leader_id => current_user.id, :subscriber_id => params[:id])
    @subscribtion.viewed = true
    @subscribtion.save
    render :nothing => true
  end
end

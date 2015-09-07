class CommunitiesController < ApplicationController
  #load_and_authorize_resource
  
  def index
    @communities = []
    if params[:user_id]
      communities = User.find(params[:user_id]).communities.order(:created_at => :desc)#.group_by(&:aim)
    else
      communities = Community.all.order(:created_at => :desc)#.group_by(&:aim)
    end
    communities.each do |community|
      @communities << {community: community, participants: community.users.count}
    end
    respond_to do |format|
      format.html
      format.json { render json: @communities}
    end
  end
  
  def show
    @community = Community.find params[:id]
    respond_to do |format|
      format.html
      format.json { render json: {community: @community, participants: @community.users, participates: (@community.users.include? current_user)}}
    end
  end
  
  def create
    community = Community.new(community_params)
    community.save!
    community.users << current_user
    #community.contacts << current_user
    respond_to do |format|
      format.html
      format.json {render json: {id: community.id}}
    end
  end
  
  def join
    @community = Community.find params[:id]
    @community.users << current_user
    respond_to do |format|
      format.html 
      format.json { head :no_content }
    end
  end
  
  def leave
    @community = Community.find params[:id]
    @community.users.destroy current_user
    respond_to do |format|
      format.html 
      format.json { head :no_content }
    end
  end
  
  def update
  end
  
  def destroy
  end
  
  private
  
  def community_params
    params.require(:community).permit!
  end
end

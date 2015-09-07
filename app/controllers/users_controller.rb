class UsersController < ApplicationController
  load_and_authorize_resource
  before_action :set_user, only: [:show, :userpage_media, :edit, :update]
  
  def show
    respond_to do |format|
      format.html
      format.json {respond_with @user}
    end
  end  
  
  def userpage_media
    last_pictures = Array.new
    @user.pictures.last(3).each do |picture|
      root_comments = User.add_names_pics picture.root_comments
      last_pictures << {picture: picture, root_comments: root_comments, tags: picture.tag_list.map{|tag| {text: tag}}}
    end
    last_songs = @user.songs.last(3)
    last_videos = @user.videos.last(2)
    if current_user and current_user.id == @user.id
      @number_of_friendship_requests = Subscription.where(:leader_id => @user.id, :viewed => false).count
    end
    @number_of_friends = @user.friends.count
    relations = @user.relations current_user
    
    random_friends = @user.friends.to_a.shuffle.take(3)
    
    respond_to do |format|
      format.html
      format.json {render json: {number_of_friendship_requests: @number_of_friendship_requests, number_of_friends: @number_of_friends, random_friends: random_friends, last_pictures: last_pictures, last_songs: last_songs,  last_videos: last_videos, relations: relations}}
    end
  end
  
  def update
    if (params[:avatar_url])
      avatar_url = params[:avatar_url]
    else
      avatar = Picture.upload picture_params
      avatar_url = avatar.url
    end
    @user.avatar_url = avatar_url
    @user.save!
    respond_to do |format|
      format.html
      format.json {render json: {avatar: avatar_url}}
    end
  end 
  
  def edit
    @user.first_name = params[:first_name]
    @user.last_name =  params[:last_name]
    @user.email = params[:email]
    @user.save!
    respond_to do |format|
      format.html
      format.json { head :no_content}
    end
  end
  
  private
  
  def picture_params
    params.require(:picture).permit!
  end
  
  def set_user
    @user = User.find(params[:id])
  end
end

class VideosController < ApplicationController
  #load_and_authorize_resource
  
  def index
    videos = Array.new
    User.find(params[:user_id]).videos.order(:created_at => :desc).each do |video|
      root_comments = User.add_names_pics video.root_comments
      videos << {video: video, root_comments: root_comments, tags: video.tag_list.map{|tag| {text: tag}}}
    end
    respond_to do |format|
      format.html
      format.json { render json: videos}
    end
  end
  
  def create
    if video_params[:id]
      video = Video.find(video_params[:id].to_i)
      if !(video.users.include? current_user)
        video.owners = video.owners + 1
        video.save
      end
    else
      video = Video.create(video_params)
      video.url = video.file.url
      video.title = File.basename(video.file_file_name, File.extname(video.file_file_name))
    end
    if !(video.users.include? current_user)
      current_user.videos << video
      video.save!
    else
      video = {error: "Duplicate"}
    end
    respond_to do |format|
      format.html
      format.json { render json: video}
    end
  end
  
  def update
    video = Video.find(params[:id])
    if video.owners > 1
      videoCopy = Video.new
      videoCopy.file = video.file
      videoCopy.save!
      videoCopy.url = videoCopy.file.url
      videoCopy.title = video.title
      current_user.videos << videoCopy
      current_user.videos.destroy video
      video = videoCopy
    end
    video.title = params[:title]
    video.save!
    respond_to do |format|
      format.html
      format.json { head :no_content}
    end
  end
  
  def destroy
    video = Video.find params[:id]
    if video.owners == 1
      video.file.destroy
      video.destroy
    else
      current_user.videos.destroy video
      video.owners = video.owners - 1
      video.save
    end
    respond_to do |format|
      format.html
      format.json { head :no_content}
    end
  end
 
  def toggle_like
    @video = Video.find params[:video_id]
    current_user.toggle_like!(@video)
    respond_to do |format|
      format.html 
      format.json { render json: {increment: current_user.likes?(@video)} }
    end
  end
  
  private

  def video_params
    params.require(:video).permit!
  end
end

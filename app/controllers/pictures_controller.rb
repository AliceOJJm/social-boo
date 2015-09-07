class PicturesController < ApplicationController
  load_and_authorize_resource
  
  def index
    pictures = Array.new
    User.find(params[:user_id]).pictures.order(:created_at => :desc).each do |picture|
      root_comments = User.add_names_pics picture.root_comments
      pictures << {picture: picture, root_comments: root_comments, tags: picture.tag_list.map{|tag| {text: tag}}}
    end
    respond_to do |format|
      format.html
      format.json { render json: pictures}
    end
  end
  
  def create
    picture = Picture.upload(picture_params)
    respond_to do |format|
      format.html
      format.json { render json: picture}
    end
  end
  
  def destroy
    picture = Picture.find params[:id]
    picture.file.destroy
    picture.destroy
    respond_to do |format|
      format.html
      format.json { head :no_content}
    end
  end
 
  def toggle_like
    @picture = Picture.find params[:picture_id]
    current_user.toggle_like!(@picture)
    respond_to do |format|
      format.html 
      format.json { render json: {increment: current_user.likes?(@picture)} }
    end
  end
  
  private

  def picture_params
    params.require(:picture).permit!
  end
end

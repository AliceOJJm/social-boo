class TagsController < ApplicationController
  def show
    response = Array.new
    ActsAsTaggableOn::Tag.all.each do |tag|
      response.push({"text" => tag.name}) if tag.name.include? params[:query]
    end
    respond_to do |format|
      format.html
      format.json {render json: response}
    end
  end
  
  def create
    taggable = find_by_type params[:type]
    taggable.tag_list.add params[:tag]
    taggable.save
    respond_to do |format|
      format.html
      format.json {head :no_content}
    end
  end
  
  def destroy
    taggable = find_by_type params[:type]
    taggable.tag_list.remove params[:tag]
    taggable.save
    respond_to do |format|
      format.html
      format.json {head :no_content}
    end
  end
  
  private
  
  def find_by_type type
    if type == "post"
      taggable = Post.find params[:taggable_id]
    elsif type == "picture"
      taggable = Picture.find params[:taggable_id]
    elsif type == "song"
      taggable = Song.find params[:taggable_id]
    elsif type == "video"
      taggable = Video.find params[:taggable_id]
    end
    taggable
  end
end

class CommentsController < ApplicationController
  def index
    
  end
  
  def create
    if params[:type] == "post"
      @commentable = Post.find(params[:id])
    elsif params[:type] == "picture"
      @commentable = Picture.find(params[:id])
    elsif params[:type] == "video"
      @commentable = Video.find(params[:id])
    end
    @comment = Comment.build_from( @commentable, current_user.id, params[:comment])
    @comment.save!
    user = User.find @comment.user_id
    respond_to do |format|
      format.html 
      format.json { render json: {content: @comment, user_name: user.first_name + " " + user.last_name, user_pic: user.avatar_url} }
    end
  end
  
  def destroy
    @comment =  Comment.find params[:id]
    @comment.destroy
    respond_to do |format|
      format.html 
      format.json { head :no_content }
    end
  end
 
  def toggle_like
    @comment =  Comment.find params[:comment_id]
    current_user.toggle_like!(@comment)
    respond_to do |format|
      format.html 
      format.json { render json: {increment: current_user.likes?(@comment)} }
    end
  end
  
  private
    def comment_params
      params.require(:comment).permit!
    end
end

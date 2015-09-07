class SearchController < ApplicationController
  def index
    @people = User.fulltext_search params[:search_by]
    p @people
    @songs = Song.fulltext_search params[:search_by]
    @videos = Video.fulltext_search params[:search_by]
    posts = Post.fulltext_search params[:search_by]
    @posts = Array.new
    posts.each do |post|
      root_comments = []#User.add_names_pics post._source.root_comments
      @posts << {post: {post: post}, root_comments: root_comments}
    end
    respond_to do |format|
      format.html
      format.json { render json: {people: @people, songs: @songs, videos: @videos, posts: @posts}}
    end
  end
end

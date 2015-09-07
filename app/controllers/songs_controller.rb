class SongsController < ApplicationController
  #load_and_authorize_resource
  
  def index
    @songs = User.find(params[:user_id].to_i).songs.order(:created_at => :desc)
    respond_to do |format|
      format.html
      format.json { render json: @songs}
    end
  end
  
  def create
    if song_params[:id]
      song = Song.find(song_params[:id].to_i)
      song.owners = song.owners + 1
      song.save
    else
      song = Song.create(song_params)
      song.url = song.file.url
      song.performer, song.title = song.metadata.values_at('artist', 'title') if song.metadata
      if !song.title.present? 
        song.title = song.file_file_name
      end
    end
    current_user.songs << song
    song.save!
    
    respond_to do |format|
      format.html
      format.json { render json: song}
    end
  end
  
  def update
    song = Song.find(params[:id])
    if song.owners > 1
      songCopy = Song.new
      songCopy.file = song.file
      songCopy.save!
      songCopy.url = songCopy.file.url
      songCopy.title, songCopy.performer = [song.title, song.performer]
      current_user.songs << songCopy
      current_user.songs.destroy song
      song = songCopy
    end
    if params[:name] == "title"
      song.title = params[:value]
    else
      song.performer = params[:value]
    end
    song.save!
    respond_to do |format|
      format.html
      format.json { head :no_content}
    end
  end
  
  def destroy
    song = Song.find params[:id]
    if song.owners == 1
      song.file.destroy
      song.destroy
    else
      User.find(params[:user_id].to_i).songs.destroy song
      song.owners = song.owners - 1
      song.save
    end
    respond_to do |format|
      format.html
      format.json { head :no_content}
    end
  end
 
  def toggle_like
    @song = Song.find params[:song_id]
    current_user.toggle_like!(@song)
    respond_to do |format|
      format.html 
      format.json { render json: {increment: current_user.likes?(@song)} }
    end
  end
  
  private

  def song_params
    params.require(:song).permit!
  end
  
end

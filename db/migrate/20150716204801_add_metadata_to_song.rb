class AddMetadataToSong < ActiveRecord::Migration
  def change
    add_column :songs, :metadata, :text
  end
end

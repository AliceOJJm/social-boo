class AddOwnersToSongs < ActiveRecord::Migration
  def change
    add_column :songs, :owners, :integer, :default => 1
    add_column :videos, :owners, :integer, :default => 1
  end
end

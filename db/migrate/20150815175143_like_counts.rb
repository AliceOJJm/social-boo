class LikeCounts < ActiveRecord::Migration
  def change
    add_column :songs, :likers_count, :integer, :default => 0
    add_column :videos, :likers_count, :integer, :default => 0
    add_column :pictures, :likers_count, :integer, :default => 0
    add_column :posts, :likers_count, :integer, :default => 0
    add_column :users, :likees_count, :integer, :default => 0
  end
end

class DeleteAvatars < ActiveRecord::Migration
  def change
    remove_column :users, :avatar_url
    remove_column :communities, :avatar_url
  end
end

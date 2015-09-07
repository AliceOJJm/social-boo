class AddFkFriendship < ActiveRecord::Migration
  def change
    add_foreign_key :friendships, :users, column: :user_id
    add_foreign_key :friendships, :users, column: :friend_id
  end
end

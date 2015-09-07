class CreateIndexes < ActiveRecord::Migration
  def change
    add_index "friendships", ["friend_id"], name: "index_friendships_on_friend_id", using: :btree
    add_index "friendships", ["user_id"], name: "index_friendships_on_user_id", using: :btree
  end
end

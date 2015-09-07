class AddDefaultAvatar < ActiveRecord::Migration
  def change
    change_column :users, :avatar_url, :string, :default => "http://read.me/images/userpic-177.png"
  end
end

class ChangeSongsUsers < ActiveRecord::Migration
  def change
    drop_table :users_songs
    create_table :songs_users, id: false do |t|
      t.belongs_to :user, index: true
      t.belongs_to :song, index: true
    end
  end
end

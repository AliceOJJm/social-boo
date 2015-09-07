class ChangeSongs < ActiveRecord::Migration
  def change
    create_table :users_songs, id: false do |t|
      t.belongs_to :user, index: true
      t.belongs_to :song, index: true
    end
  end
end

class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :url
      t.references :user, index: true, foreign_key: true
      t.string :title
      t.string :performer
      t.string :genre

      t.timestamps null: false
    end
  end
end

class CreateCommunities < ActiveRecord::Migration
  def change
    create_table :communities do |t|
      t.string :title
      t.string :aim
      t.text :description
      t.string :avatar_url

      t.timestamps null: false
    end
  end
end

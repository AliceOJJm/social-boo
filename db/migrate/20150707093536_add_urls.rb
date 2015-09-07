class AddUrls < ActiveRecord::Migration
  def change
    add_column :pictures, :thumb_url, :string
    add_column :pictures, :medium_url, :string
  end
end

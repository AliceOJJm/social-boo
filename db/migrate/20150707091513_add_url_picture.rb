class AddUrlPicture < ActiveRecord::Migration
  def change
    add_column :pictures, :url, :string
  end
end

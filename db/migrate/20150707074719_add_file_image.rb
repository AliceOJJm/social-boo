class AddFileImage < ActiveRecord::Migration
  def change
    add_attachment :pictures, :file
    remove_column :pictures, :url
  end
end

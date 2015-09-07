class AddColumnToMessage < ActiveRecord::Migration
  def change
    add_column :messages, :viewed, :boolean, :default => false
  end
end

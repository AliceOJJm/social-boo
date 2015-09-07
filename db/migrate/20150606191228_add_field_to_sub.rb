class AddFieldToSub < ActiveRecord::Migration
  def change
     add_column :subscriptions, :viewed, :boolean, :default => false
  end
end

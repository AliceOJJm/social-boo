class CreateSubscriptions < ActiveRecord::Migration
  def change
    create_table :subscriptions do |t|
      t.integer :leader_id
      t.integer :subscriber_id

      t.timestamps null: false
    end
  end
end

class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.text :text
      t.integer :sender_id
      t.integer :receiver_id
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end

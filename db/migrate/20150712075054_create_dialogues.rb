class CreateDialogues < ActiveRecord::Migration
  def change
    create_table :dialogues do |t|
      t.string :title
      t.timestamps null: false
    end
    create_table :dialogues_users, id: false do |t|
      t.belongs_to :dialogue, index: true
      t.belongs_to :user, index: true
    end
  end
end

class DeleteUserFromVideo < ActiveRecord::Migration
  def change
    create_table :videos_users, id: false do |t|
      t.belongs_to :user, index: true
      t.belongs_to :video, index: true
    end
  end
end

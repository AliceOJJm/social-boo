class AddDialogueRefToMessages < ActiveRecord::Migration
  def change
    add_reference :messages, :dialogue, index: true, foreign_key: true
  end
end

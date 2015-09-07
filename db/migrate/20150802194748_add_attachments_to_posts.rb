class AddAttachmentsToPosts < ActiveRecord::Migration
  def change
    add_reference :pictures, :attachable, polymorphic: true, index: true
    add_reference :songs, :attachable, polymorphic: true, index: true
    add_reference :videos, :attachable, polymorphic: true, index: true
  end
end

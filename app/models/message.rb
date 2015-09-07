class Message < ActiveRecord::Base
  belongs_to :user
  has_many :pictures, as: :attachable
  has_many :songs, as: :attachable
  has_many :videos, as: :attachable
end

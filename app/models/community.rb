require 'elasticsearch/model'

class Community < ActiveRecord::Base
  acts_as_taggable_on :tags
  has_and_belongs_to_many :users
  #has_many :contacts, class_name: "User"
end

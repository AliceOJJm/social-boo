class Subscription < ActiveRecord::Base
  belongs_to :leader, class_name: 'User'
  belongs_to :subscriber, class_name: 'User'
end

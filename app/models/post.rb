require 'elasticsearch/model'

class Post < ActiveRecord::Base
  include Elasticsearch::Model
  
  belongs_to :user
  has_many :pictures, as: :attachable
  has_many :songs, as: :attachable
  has_many :videos, as: :attachable
  
  acts_as_taggable
  acts_as_commentable
  acts_as_likeable
  
  #searchable do
  #  text :content, boost: 5.0
  #end

  def self.fulltext_search search_by
    #Post.search{fulltext search_by}.results
    response = Post.search search_by
    response.results.map{|result| result._source}
  end
end

require 'elasticsearch/model'

class Video < ActiveRecord::Base
  include Elasticsearch::Model
  
  has_and_belongs_to_many :users
  belongs_to :attachable, polymorphic: true
  
  has_attached_file :file

  validates_attachment :file, :content_type => { :content_type => /\Avideo\/.*\Z/},
                              :size => { :less_than => 2.gigabytes }
  acts_as_taggable
  acts_as_likeable
  acts_as_commentable
  
  #searchable do
  #  text :title, boost: 5.0
  #end
  
  def self.fulltext_search search_by
  #  Video.search{fulltext search_by}.results
     response = Video.search search_by
    response.results.map{|result| result._source}
  end
end

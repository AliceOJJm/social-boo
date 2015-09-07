class Picture < ActiveRecord::Base
  belongs_to :user
  belongs_to :attachable, polymorphic: true
  has_attached_file :file, :styles => { :medium => "250x250>", :thumb => "100x100>" }

  validates_attachment :file, :content_type => { :content_type => /\Aimage\/.*\Z/ },
                                :size => { :less_than => 1.megabytes }
                                
  acts_as_taggable
  acts_as_commentable
  acts_as_likeable
  
  def self.upload picture_params
    picture = Picture.create(picture_params)
    picture.url = picture.file.url
    picture.thumb_url = picture.file.url(:thumb)
    picture.medium_url = picture.file.url(:medium)
    picture.save!
    picture
  end
end

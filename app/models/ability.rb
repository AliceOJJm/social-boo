class Ability
  include CanCan::Ability

  def initialize(user)
     if user
       if user.roles.find_by(:name => 'admin')
         can :manage, :all
       elsif user.roles.find_by(:name => 'user')
         can :read, :all
         can :userpage_media, User
         can :manage, User, :id => user.id
         can :manage, [Dialogue, Message, Picture, Post, Song, Video], :user_id => user.id
         can :manage, Subscription
       end
     end
  end
end

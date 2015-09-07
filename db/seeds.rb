#  Role.create(:name => :admin)
#  Role.create(:name => :user)
User.__elasticsearch__.create_index! force: true
Video.__elasticsearch__.create_index! force: true
Song.__elasticsearch__.create_index! force: true
Post.__elasticsearch__.create_index! force: true
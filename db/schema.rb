# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150830162012) do

  create_table "comments", force: :cascade do |t|
    t.integer  "commentable_id",   limit: 4
    t.string   "commentable_type", limit: 255
    t.string   "title",            limit: 255
    t.text     "body",             limit: 65535
    t.string   "subject",          limit: 255
    t.integer  "user_id",          limit: 4,                 null: false
    t.integer  "parent_id",        limit: 4
    t.integer  "lft",              limit: 4
    t.integer  "rgt",              limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "likers_count",     limit: 4,     default: 0
  end

  add_index "comments", ["commentable_id", "commentable_type"], name: "index_comments_on_commentable_id_and_commentable_type", using: :btree
  add_index "comments", ["user_id"], name: "index_comments_on_user_id", using: :btree

  create_table "communities", force: :cascade do |t|
    t.string   "title",       limit: 255
    t.string   "aim",         limit: 255
    t.text     "description", limit: 65535
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "communities_users", id: false, force: :cascade do |t|
    t.integer "user_id",      limit: 4
    t.integer "community_id", limit: 4
  end

  add_index "communities_users", ["community_id"], name: "index_communities_users_on_community_id", using: :btree
  add_index "communities_users", ["user_id"], name: "index_communities_users_on_user_id", using: :btree

  create_table "dialogues", force: :cascade do |t|
    t.string   "title",      limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "dialogues_users", id: false, force: :cascade do |t|
    t.integer "dialogue_id", limit: 4
    t.integer "user_id",     limit: 4
  end

  add_index "dialogues_users", ["dialogue_id"], name: "index_dialogues_users_on_dialogue_id", using: :btree
  add_index "dialogues_users", ["user_id"], name: "index_dialogues_users_on_user_id", using: :btree

  create_table "friendships", force: :cascade do |t|
    t.integer  "user_id",    limit: 4
    t.integer  "friend_id",  limit: 4
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
  end

  add_index "friendships", ["friend_id"], name: "index_friendships_on_friend_id", using: :btree
  add_index "friendships", ["user_id"], name: "index_friendships_on_user_id", using: :btree

  create_table "likes", force: :cascade do |t|
    t.string   "liker_type",    limit: 255
    t.integer  "liker_id",      limit: 4
    t.string   "likeable_type", limit: 255
    t.integer  "likeable_id",   limit: 4
    t.datetime "created_at"
  end

  add_index "likes", ["likeable_id", "likeable_type"], name: "fk_likeables", using: :btree
  add_index "likes", ["liker_id", "liker_type"], name: "fk_likes", using: :btree

  create_table "mentions", force: :cascade do |t|
    t.string   "mentioner_type",   limit: 255
    t.integer  "mentioner_id",     limit: 4
    t.string   "mentionable_type", limit: 255
    t.integer  "mentionable_id",   limit: 4
    t.datetime "created_at"
  end

  add_index "mentions", ["mentionable_id", "mentionable_type"], name: "fk_mentionables", using: :btree
  add_index "mentions", ["mentioner_id", "mentioner_type"], name: "fk_mentions", using: :btree

  create_table "messages", force: :cascade do |t|
    t.text     "text",        limit: 65535
    t.integer  "sender_id",   limit: 4
    t.integer  "user_id",     limit: 4
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
    t.integer  "dialogue_id", limit: 4
    t.boolean  "viewed",      limit: 1,     default: false
  end

  add_index "messages", ["dialogue_id"], name: "index_messages_on_dialogue_id", using: :btree
  add_index "messages", ["user_id"], name: "index_messages_on_user_id", using: :btree

  create_table "pictures", force: :cascade do |t|
    t.integer  "user_id",           limit: 4
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
    t.string   "file_file_name",    limit: 255
    t.string   "file_content_type", limit: 255
    t.integer  "file_file_size",    limit: 4
    t.datetime "file_updated_at"
    t.string   "url",               limit: 255
    t.string   "thumb_url",         limit: 255
    t.string   "medium_url",        limit: 255
    t.integer  "attachable_id",     limit: 4
    t.string   "attachable_type",   limit: 255
    t.integer  "likers_count",      limit: 4,   default: 0
  end

  add_index "pictures", ["attachable_type", "attachable_id"], name: "index_pictures_on_attachable_type_and_attachable_id", using: :btree
  add_index "pictures", ["user_id"], name: "index_pictures_on_user_id", using: :btree

  create_table "posts", force: :cascade do |t|
    t.text     "content",      limit: 65535
    t.integer  "user_id",      limit: 4
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.integer  "likers_count", limit: 4,     default: 0
  end

  add_index "posts", ["user_id"], name: "index_posts_on_user_id", using: :btree

  create_table "roles", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "songs", force: :cascade do |t|
    t.string   "url",               limit: 255
    t.integer  "user_id",           limit: 4
    t.string   "title",             limit: 255
    t.string   "performer",         limit: 255
    t.string   "genre",             limit: 255
    t.datetime "created_at",                                  null: false
    t.datetime "updated_at",                                  null: false
    t.string   "file_file_name",    limit: 255
    t.string   "file_content_type", limit: 255
    t.integer  "file_file_size",    limit: 4
    t.datetime "file_updated_at"
    t.text     "metadata",          limit: 65535
    t.integer  "attachable_id",     limit: 4
    t.string   "attachable_type",   limit: 255
    t.integer  "owners",            limit: 4,     default: 1
    t.integer  "likers_count",      limit: 4,     default: 0
  end

  add_index "songs", ["attachable_type", "attachable_id"], name: "index_songs_on_attachable_type_and_attachable_id", using: :btree
  add_index "songs", ["user_id"], name: "index_songs_on_user_id", using: :btree

  create_table "songs_users", id: false, force: :cascade do |t|
    t.integer "user_id", limit: 4
    t.integer "song_id", limit: 4
  end

  add_index "songs_users", ["song_id"], name: "index_songs_users_on_song_id", using: :btree
  add_index "songs_users", ["user_id"], name: "index_songs_users_on_user_id", using: :btree

  create_table "subscriptions", force: :cascade do |t|
    t.integer  "leader_id",     limit: 4
    t.integer  "subscriber_id", limit: 4
    t.datetime "created_at",                              null: false
    t.datetime "updated_at",                              null: false
    t.boolean  "viewed",        limit: 1, default: false
  end

  create_table "taggings", force: :cascade do |t|
    t.integer  "tag_id",        limit: 4
    t.integer  "taggable_id",   limit: 4
    t.string   "taggable_type", limit: 255
    t.integer  "tagger_id",     limit: 4
    t.string   "tagger_type",   limit: 255
    t.string   "context",       limit: 128
    t.datetime "created_at"
  end

  add_index "taggings", ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], name: "taggings_idx", unique: true, using: :btree
  add_index "taggings", ["taggable_id", "taggable_type", "context"], name: "index_taggings_on_taggable_id_and_taggable_type_and_context", using: :btree

  create_table "tags", force: :cascade do |t|
    t.string  "name",           limit: 255
    t.integer "taggings_count", limit: 4,   default: 0
  end

  add_index "tags", ["name"], name: "index_tags_on_name", unique: true, using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                  limit: 255, default: "",                                      null: false
    t.string   "encrypted_password",     limit: 255, default: "",                                      null: false
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          limit: 4,   default: 0,                                       null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "first_name",             limit: 255
    t.string   "last_name",              limit: 255
    t.string   "gender",                 limit: 255
    t.string   "avatar_url",             limit: 255, default: "http://read.me/images/userpic-177.png"
    t.date     "birth_date"
    t.string   "confirmation_token",     limit: 255
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email",      limit: 255
    t.integer  "likees_count",           limit: 4,   default: 0
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  create_table "users_roles", force: :cascade do |t|
    t.integer  "user_id",    limit: 4
    t.integer  "role_id",    limit: 4
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
  end

  add_index "users_roles", ["role_id"], name: "index_users_roles_on_role_id", using: :btree
  add_index "users_roles", ["user_id"], name: "index_users_roles_on_user_id", using: :btree

  create_table "users_videos", id: false, force: :cascade do |t|
    t.integer "user_id",  limit: 4
    t.integer "video_id", limit: 4
  end

  add_index "users_videos", ["user_id"], name: "index_users_videos_on_user_id", using: :btree
  add_index "users_videos", ["video_id"], name: "index_users_videos_on_video_id", using: :btree

  create_table "videos", force: :cascade do |t|
    t.string   "url",               limit: 255
    t.integer  "user_id",           limit: 4
    t.string   "title",             limit: 255
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
    t.string   "file_file_name",    limit: 255
    t.string   "file_content_type", limit: 255
    t.integer  "file_file_size",    limit: 4
    t.datetime "file_updated_at"
    t.integer  "attachable_id",     limit: 4
    t.string   "attachable_type",   limit: 255
    t.integer  "owners",            limit: 4,   default: 1
    t.integer  "likers_count",      limit: 4,   default: 0
  end

  add_index "videos", ["attachable_type", "attachable_id"], name: "index_videos_on_attachable_type_and_attachable_id", using: :btree
  add_index "videos", ["user_id"], name: "index_videos_on_user_id", using: :btree

  create_table "videos_users", id: false, force: :cascade do |t|
    t.integer "user_id",  limit: 4
    t.integer "video_id", limit: 4
  end

  add_index "videos_users", ["user_id"], name: "index_videos_users_on_user_id", using: :btree
  add_index "videos_users", ["video_id"], name: "index_videos_users_on_video_id", using: :btree

  add_foreign_key "friendships", "users"
  add_foreign_key "friendships", "users", column: "friend_id"
  add_foreign_key "messages", "dialogues"
  add_foreign_key "messages", "users"
  add_foreign_key "pictures", "users"
  add_foreign_key "posts", "users"
  add_foreign_key "songs", "users"
  add_foreign_key "users_roles", "roles"
  add_foreign_key "users_roles", "users"
  add_foreign_key "videos", "users"
end

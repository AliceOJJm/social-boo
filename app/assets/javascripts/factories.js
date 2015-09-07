angular.module('boo-factories', ['boo']);

angular.module('boo-factories').factory('users', ['$http', 
function($http){
  var o = {
  	user: {},
    friends: [],
    subscribers: [],
    subscriptions: [],
    new_subscribers: [],
    userpage_media: {}
  };
  o.getUser = function(id){
  	return $http.get( '/users/' + id + '.json').success(function(res){
      angular.copy(res, o.user);
    });
  };
  
  o.updateUser = function(user){
  	return $http.post("/users/" + user.id + '/edit.json', user);
  };
  
  o.getUserpageMedia = function(id){
  	return $http.get( '/users/' + id + '/userpage_media.json').success(function(res){
      angular.copy(res, o.userpage_media);
    });
  };
  
  o.getUsersFriends = function(id){
  	return $http.get( "/users/" + id + "/friends.json").success(function(res){
      angular.copy(res.friends, o.friends);
      angular.copy(res.subscribers, o.subscribers);
      angular.copy(res.new_subscribers, o.new_subscribers);
      angular.copy(res.subscriptions, o.subscriptions);
    });
  };
  
  o.unsubscribe = function(user_id, friend, callback) {
	  return $http.delete('/users/' + user_id + '/subscribtions/' + friend.user.id + '.json').success(function(data){
	    o.subscriptions.splice(o.subscriptions.indexOf(friend), 1);
	    o.userpage_media.relations = "none";
	    callback();
	  });
  };
  
  o.addFriend = function(user_id, subscriber, callback) {
	  return $http.post('/users/' + user_id + '/subscribtions.json', {subscriber_id: subscriber.user.id}).success(function(data){
	    o.new_subscribers.splice(o.new_subscribers.indexOf(subscriber), 1);
	    o.subscribers.splice(o.subscribers.indexOf(subscriber), 1);
	    o.friends.push(data);
	    if(o.userpage_media.relations == "none"){
	    	o.userpage_media.relations = "leader";
	    }else if (o.userpage_media.relations == "subscriber"){
	    	o.userpage_media.relations = "friend";
	    }
	    callback();
	  });
  };
  
  o.deleteFriend = function(user_id, friend, callback) {
	  return $http.delete('/users/' + user_id + '/subscribtions/' + friend.user.id + '.json').success(function(data){
	    o.friends.splice(o.friends.indexOf(friend), 1);
	    o.userpage_media.relations = "subscriber";
	    callback();
	  });
  };
  
  o.markReqViewed = function(user_id, friend) {
	  return $http.get('/users/' + user_id + '/subscribtions/'+ friend.user.id + '/edit.json').success(function(data){
	    o.new_subscribers.splice(o.new_subscribers.indexOf(friend), 1);
	  });
  };
  
  return o;
}]);

angular.module('boo-factories').factory('posts', ['$http', 'search',
function($http, search){
  var o = {
    posts: []
  };
  
  o.getUsersPosts = function(id){
  	return $http.get( "/users/" + id + "/posts.json").success(function(res){
      angular.copy(res, o.posts);
    });
  };
  
  o.addPost = function(post){
  	return $http.post("/users/" + post.user_id + '/posts.json', post).success(function(res){
      o.posts.push({post: res, root_comments: []});
    });
  };
  o.deletePost = function(post){
  	return $http.delete( "/users/" + post.post.post.user_id + '/posts/' + post.post.post.id + '.json').success(function(res){
      o.posts.splice(o.posts.indexOf(post), 1);
      search.results.posts.splice(search.results.posts.indexOf(post), 1);
    });
  };
  return o;
}]);

angular.module('boo-factories').factory('comments', ['$http', 'posts', 'pictures', 'search', 'videos', 
function($http, posts, pictures, search, videos){
  var o = {
    comments: []
  };
  
  o.addComment = function(commentable_id, commentable, comment, type, callback){
  	return $http.post( "/comments.json", {id: commentable_id, comment: comment, type: type}).success(function(res){
      if (type == "post"){
	      	var post_index = posts.posts.indexOf(commentable);
			if(post_index != -1){
		  		posts.posts[post_index].root_comments.push(res);
		  	}else{
			  	post_index = search.results.posts.indexOf(commentable);
			  	search.results.posts[post_index].root_comments.push(res);
			}
	  	}else if (type == "video"){
	  		var video_index = videos.videos.indexOf(commentable);
	  		videos.videos[video_index].root_comments.push(res);
	  	}else if (type == "picture"){
	  		callback(res);
	  	}
    });
  };
  
  o.deleteComment = function(commentable, comment, type){
  	return $http.delete( '/comments/' + comment.content.comment.id + '.json').success(function(res){
  		if (type == "post"){
			var post_index = posts.posts.indexOf(commentable);
			var comment_index;
			if(post_index != -1){
				comment_index = posts.posts[post_index].root_comments.indexOf(comment);
				posts.posts[post_index].root_comments.splice(comment_index, 1);
			}else{
			  	post_index = search.results.posts.indexOf(commentable);
			  	comment_index = search.results.posts[post_index].root_comments.indexOf(comment);
			  	search.results.posts[post_index].root_comments.splice(comment_index, 1);
		    } 
		}
    });
  };
  
  return o;
}]);

angular.module('boo-factories').factory('audio', ['$http', '$sce',
function($http, $sce){
  var o = {
    songs: [],
    user_id: 0,
    hi: "KIII!"
  };
  
  o.getUsersSongs = function(id){
  	return $http({
			    url: "/songs.json", 
			    method: "GET",
			    params: {user_id: id}
	 		}).then(function(res){
			        angular.copy(res.data, o.songs);
     				o.user_id = id;
				});
  };
  o.addSong = function(song){
      o.songs.push(song);
  };
  
  o.updateSong = function(song){
  	return $http.patch( '/songs/' + song.song.id + '.json', {title: song.song.title, performer: song.song.performer});
  };
  
  o.audio_tag = function(url){
    	return $sce.trustAsHtml('<audio src="' + url + '" controls></audio>');
  };
  
  return o;
}]);

angular.module('boo-factories').factory('pictures', ['$http',
function($http){
  var o = {
    pictures: [],
    user_id: 0
  };
  
  o.getUsersPictures = function(id){
  	return $http.get( "/users/" + id + "/pictures.json").success(function(res){
      angular.copy(res, o.pictures);
      o.user_id = id;
    });
  };
  o.addPicture = function(picture){
  		o.pictures.push(picture);
  };
  
  o.deletePicture = function(picture, callback){
  	o.pictures.splice(o.pictures.indexOf(picture), 1);
  	return $http.delete( "/users/" + picture.picture.user_id + '/pictures/' + picture.picture.id + '.json').success(function(res){
      callback();
    });
  };
  
  o.setAvatar = function(picture){
  	return $http({
			    url: "/users/" + picture.user_id + ".json", 
			    method: "PUT",
			    params: {avatar_url: picture.url}
	 		});
  };
  
  return o;
}]);

angular.module('boo-factories').factory('videos', ['$http', '$sce', 'Notification',
function($http, $sce, Notification){
  var o = {
    videos: [],
    user_id: 0
  };
  
  o.getUsersVideos = function(id){
  	return $http({
			    url: "/videos.json", 
			    method: "GET",
			    params: {user_id: id}
	 		}).then(function(res){
			        angular.copy(res.data, o.videos);
     				o.user_id = id;
				});
  };
  
  o.addVideo = function(video){
  		o.videos.unshift(video);
  };

  o.updateVideo = function(video){
  	return $http.patch( '/videos/' + video.video.video.id + '.json', {title: video.video.video.title});
  };
  
  o.copyVideo = function(id){
  	return $http.post( '/videos.json', {video: {id: id}}).success(function(res){
  		if(res.error == "Duplicate"){
  			message = "This video is alrady added!";
  		}else{
  			message = "Successfully added video";
  		}
        Notification.success(message);
    });
  };
  
  o.video_tag = function(url){
    	return $sce.trustAsHtml('<video src="' + url + '" controls width="360" height="240"></video>');
    };
  
  o.small_video_tag = function(url){
    	return $sce.trustAsHtml('<video src="' + url + '" controls width="150" height="100"></video>');
    };
    
  o.deleteVideo = function(video){
  	return $http.delete( '/videos/' + video.video.video.id + '.json').success(function(res){
      o.videos.splice(o.videos.indexOf(video), 1);
    });
  };
  
  return o;
}]);

angular.module('boo-factories').factory('mail', ['$http',
function($http){
  var o = {
    dialogues: [],
    messages: [],
    dialogue_id: 0
  };
  
  o.getUsersDialogues = function(id){
  	return $http.get( "/users/" + id + "/dialogues.json").success(function(res){
      angular.copy(res, o.dialogues);
    });
  };
  o.getUsersDialogue = function(id, dialogue_id){
  	return $http.get( "/users/" + id + "/dialogues/" + dialogue_id + ".json").success(function(res){
  		o.dialogue_id = dialogue_id;
        angular.copy(res, o.messages);
        o.notify(id, function(){});
    });
  };
  o.sendMessage = function(user_id, dialogue_id, message){
  	return $http.post("/users/" + user_id + "/messages.json", {dialogue_id: dialogue_id, message: message}).success(function(res){
        o.messages.push(res);
    });
  };
  o.sendMessagePage = function(message, sender_id, receiver_id){
  	return $http.post("/users/" + sender_id + "/messages.json", {receiver_id: receiver_id, message: message}).success(function(res){

    });
  };
  o.notify = function(id, callback){
  	return $http.get( "/users/" + id + "/messages.json").success(function(res){
  		callback(res.new_messages);
    });
  };
  o.clearDialogueHistory = function(user_id){
  	return $http({
			    url: "/users/" + user_id + "/dialogues/" + o.dialogue_id + ".json", 
			    method: "DELETE"
	 		});
  };
  o.deleteMessage = function(message){
  	return $http({
			    url: "/users/" + message.content.message.user_id + "/messages/" + message.content.message.id + ".json", 
			    method: "DELETE"
	 		}).then(function(res){
	 			o.messages.splice(o.messages.indexOf(message), 1);
	 		});
  };
  return o;
}]);

angular.module('boo-factories').factory('search', ['$http',
function($http){
  var o = {
	results: {},
	searchBy: {phrase: ""}
  };
  
  o.find = function(callback){
  	return $http({
			    url: "/search.json", 
			    method: "GET",
			    params: {search_by: o.searchBy.phrase}
	 		}).then(function(res){
			        angular.copy(res.data, o.results);
			        if (callback){
			        	callback(res.data);
			        }
				});
  };
  return o;
}]);

angular.module('boo-factories').factory('tags', ['$http',
function($http){
  var o = {};
  
  o.load = function(query, callback) {
      return $http({
			    url: "/tags.json", 
			    method: "GET",
			    params: {query: query}
	 		 });
	 		 
  };
   
  o.addTag = function(tag, taggableType, taggableId) {
      return $http.post('/tags.json', {type: taggableType, taggable_id: taggableId, tag: tag.text});
  };
   
  o.deleteTag = function(tag, taggableType, taggableId) {
  	  return $http({
			    url: "/tags.json", 
			    method: "DELETE",
			    params: {type: taggableType, taggable_id: taggableId, tag: tag.text}
	 		 });
  };
  
  return o;
}]);
    
angular.module('boo-factories').factory('likes', ['$http', 'posts', 'search', 'videos',
function($http, posts, search, videos){
  var o = {};
  
  o.like = function(likeable, type, callback){
  	var url = "";
  	var process;
  	if(type == "post"){
  		url = '/users/' + likeable.post.post.user_id + '/posts/' + likeable.post.post.id + '/toggle_like.json';
  		process = function(increment){
  			var post_index = posts.posts.indexOf(likeable);
			if(post_index != -1){
				if(increment){
					posts.posts[post_index].post.post.likers_count ++;
				}else{
					posts.posts[post_index].post.post.likers_count --;
				}
			}else{
			  	post_index = search.results.posts.indexOf(likeable);
				if(increment){
			  		search.results.posts[post_index].post.post.likers_count ++;
			  	}else{
			  		search.results.posts[post_index].post.post.likers_count --;
			  	}
		    } 
  		};
  	}else if (type == "picture"){
  		url = '/users/' + likeable.picture.picture.user_id + '/pictures/' + likeable.picture.picture.id + '/toggle_like.json';
  	}else if (type == "video"){
  		url = '/videos/' + likeable.video.video.id + '/toggle_like.json';
  		process = function(increment){
	  		var video_index = videos.videos.indexOf(likeable);
			if(increment){
				videos.videos[video_index].video.video.likers_count ++;
			}else{
				videos.videos[video_index].video.video.likers_count --;
			}
		};
  	}else if (type == "comment"){
  		url = '/comments/' + likeable.comment.id + '/toggle_like.json';
  	}
  	if(callback){
  		process = callback;
  	}
  	return $http.get(url).success(function(res){
  		process(res.increment);
    });
  };
  return o;
}]);

angular.module('boo-factories').factory('communities', ['$http',
function($http){
  var o = {
  	all: [],
  	current: {}
  };
  
  o.getAll = function() {
      return $http.get('/communities.json').success(function(res){
	      angular.copy(res, o.all);
	    });
  };
  
  o.get = function(id) {
      return $http.get('/communities/' + id + '.json').success(function(res){
      angular.copy(res, o.current);
    });
  };
  
  o.getUsers = function(id){
  	return $http({
			    url: "/communities.json", 
			    method: "GET",
			    params: {user_id: id}
	 		}).then(function(res){
			        angular.copy(res.data, o.all);
				});
  };
  
  o.create = function(community, callback) {
      return $http.post('/communities.json', community).success(function(res){
	      callback(res.id);
	    });
  };
  
  o.join = function(user) {
      return $http.get('/communities/' + o.current.community.community.id + '/join.json').success(function(res){
	      o.current.participates = true;
	      o.current.participants.push(user);
	    });
  };
  
  o.leave = function(user) {
      return $http.get('/communities/' + o.current.community.community.id + '/leave.json').success(function(res){
	      o.current.participates = false;
	      o.current.participants.splice(o.current.participants.indexOf(user), 1);
	    });
  };
  
  return o;
}]);
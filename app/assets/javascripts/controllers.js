angular.module('boo-controllers', ['boo']);

angular.module('boo-controllers').controller('UserpageCtrl', [
'$scope', 'Auth', 'Upload', 'Notification', 'Lightbox',
'users',
'posts',
'audio', 
'videos',
'comments',
'mail',
function($scope, Auth, Upload, Notification, Lightbox, users, posts, audio, videos, comments, mail){
	Auth.currentUser().then(function (user){
    	$scope.current_user = user.user;
    });
    
    $scope.openLightboxModal = function (index) {
	  Lightbox.openModal($scope.last_pictures, index);
	};
	
	$scope.user = users.user;
	
	$scope.number_of_friendship_requests = users.userpage_media.number_of_friendship_requests;
	$scope.last_pictures = users.userpage_media.last_pictures;
	$scope.last_songs = users.userpage_media.last_songs;
	$scope.last_videos = users.userpage_media.last_videos;
	$scope.random_friends = users.userpage_media.random_friends;
	$scope.number_of_friends = users.userpage_media.number_of_friends;
	$scope.relations = users.userpage_media.relations;
	
	$scope.audio_tag = audio.audio_tag;
	$scope.video_tag = videos.video_tag;
	$scope.small_video_tag = videos.small_video_tag;
	
	$scope.posts = posts.posts;
	
	$scope.addPost = function(){
	  if(!$scope.content || $scope.content == '') { return; }
	  posts.addPost({user_id: $scope.current_user.id, content: $scope.content});
	  $scope.content = '';
	};
	
	$scope.deleteFriend = function(current_user, user){
		users.deleteFriend(current_user, user, function(){
			$scope.relations = users.userpage_media.relations;
		});
	};
	$scope.unsubscribe = function(current_user, user){
		users.unsubscribe(current_user, user, function(){
			$scope.relations = users.userpage_media.relations;
		});
	};
	$scope.addFriend = function(current_user, user){
		users.addFriend(current_user, user, function(){
			$scope.relations = users.userpage_media.relations;
		});
	};
	
	$scope.$watch('avatar', function () {
        $scope.uploadAvatar($scope.avatar, $scope.current_user.id);
    });
    $scope.uploadAvatar = function(files, user_id){
  	if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
		        url: '/users/' + user_id + '.json',
		        method: 'PUT',
		        fields: {user_id: user_id},
		        file: file,
		        fileFormDataName: 'picture[file]',
		        formDataAppender: function(fd, key, val) {
		            if (angular.isArray(val)) {
		                angular.forEach(val, function(v) {
		                    fd.append('picture['+key+']', v);
		                });
		            } else {
		                fd.append('picture['+key+']', val);
		            }
		        }
		      }).progress(function (evt) {
                $scope.avatar.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data) {
            	$scope.user.user.avatar_url = data.avatar;
            });
        }
    }
  };
  
  $scope.sendMessage = function(){
  	$('#sendMessage').modal('hide');
  	mail.sendMessagePage($scope.message, $scope.current_user.id, $scope.user.user.id);
  	Notification.success('Message sent');
  	$scope.message = "";
  };
}]);


angular.module('boo-controllers').controller('PostCtrl', [
'$scope', 'Auth', 'Upload', 'users', 'posts', 'audio', 'videos', 'comments', 'likes', 'tags',
function($scope, Auth, Upload, users, posts, audio, videos, comments, likes, tags){	
	Auth.currentUser().then(function (user){
    	$scope.current_user = user.user;
    });
    $scope.addTag = function(tag){
    	tags.addTag(tag, "post", $scope.post.post.post.id);
    };
    $scope.deleteTag = function(tag){
    	tags.deleteTag(tag, "post", $scope.post.post.post.id);
    };
    $scope.loadTags = tags.load;
     
	$scope.deletePost = function(post){
	  posts.deletePost(post);
	};
	
	$scope.addComment = function(post_id, post){
		comments.addComment(post_id, post, $scope.comment, "post");
		$scope.comment = "";
	};
	
	$scope.deleteComment = function(commentable, comment){
		comments.deleteComment(commentable, comment, "post");
	};
	
	$scope.likePost = function(post){
		likes.like(post, "post");
	};
}]);





angular.module('boo-controllers').controller('EditCtrl', [
'$scope', 'Auth', 
'users',
function($scope, Auth, users){
	Auth.currentUser().then(function (user){
    	$scope.current_user = user.user;
    });
    $scope.updateUser = users.updateUser;
}]);


angular.module('boo-controllers').controller('HomeCtrl', [
'$scope', 'Auth',
function($scope, Auth){
	Auth.currentUser().then(function (user){
	    $scope.user = user.user;
	  });
}]);

angular.module('boo-controllers').controller('MailCtrl', [
'$scope', 'Auth', 'mail',
function($scope, Auth, mail){
	Auth.currentUser().then(function (user){
	    $scope.current_user = user.user;
	  });
	$scope.dialogues = mail.dialogues;
}]);

angular.module('boo-controllers').controller('DialogueCtrl', [
'$scope', 'Auth', 'mail',
function($scope, Auth, mail){
	Auth.currentUser().then(function (user){
	    $scope.user = user.user;
		$('.d_panel-body').scrollTop($('.chat').height());
	  });
	$scope.messages = mail.messages;
	$scope.sendMessage = function(){
		mail.sendMessage($scope.user.id, mail.dialogue_id, $scope.message);
		$scope.message = '';
	};
	$scope.deleteMessage = function(message){
		mail.deleteMessage(message);
	};
	$scope.clearHistory = function(){
		$scope.messages = [];
		mail.clearDialogueHistory($scope.user.id);
	};
}]);

angular.module('boo-controllers').controller('VideoCtrl', [
'$scope', 'Auth', 'videos', 'Upload', 'tags', 'comments', 'likes',
function($scope, Auth, videos, Upload, tags, comments, likes){
	$scope.videos = videos.videos;
	$scope.like = function(video){
		likes.like(video, "video");
	};
	$scope.user_id = videos.user_id;
	Auth.currentUser().then(function (user){
	    $scope.current_user = user.user;
	  });
	$scope.$watch('files', function () {
        $scope.uploadVideos($scope.files);
    });
    
    $scope.comments = []; 
    
    $scope.addComment = function(video){
		comments.addComment(video.video.video.id, video, $scope.comments[video.video.video.id], "video");
		$scope.comments[video.video.video.id] = "";
	};
    
    $scope.copyVideo = videos.copyVideo;
    $scope.deleteVideo = function(video){
    	videos.deleteVideo(video);
    };
	
    $scope.addTag = function(tag, id){
    	tags.addTag(tag, "video", id);
    };
    $scope.deleteTag = function(tag, id){
    	tags.deleteTag(tag, "video", id);
    };
    $scope.loadTags = tags.load;
	
    $scope.video_tag = videos.video_tag;
    $scope.updateVideo = videos.updateVideo;
    
    $scope.uploadVideos = function(files){
  	if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
		        url: '/videos.json',
		        method: 'POST',
		        file: file,
		        fileFormDataName: 'video[file]',
		        formDataAppender: function(fd, key, val) {
		            if (angular.isArray(val)) {
		                angular.forEach(val, function(v) {
		                    fd.append('video['+key+']', v);
		                });
		            } else {
		                fd.append('video['+key+']', val);
		            }
		        }
		      }).progress(function (evt) {
                file.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data) {
            	$scope.files.shift();
            	videos.addVideo({video: {video: data.video}});
            });
        }
    }
  };
}]);

angular.module('boo-controllers').controller('PicturesCtrl', [
'$scope', 'Auth', 'Upload', 'pictures', 'Lightbox',
function($scope, Auth, Upload, pictures, Lightbox){
	
	$scope.openLightboxModal = function (index) {
	  Lightbox.openModal($scope.pictures, index);
	};
	  
    $scope.pictures = pictures.pictures;
	$scope.user_id = pictures.user_id;
    
	Auth.currentUser().then(function (user){
	  $scope.user = user.user;
	});
	
	$scope.deletePicture = pictures.deletePicture;
	
	$scope.$watch('files', function () {
        $scope.uploadPictures($scope.files, $scope.user.id);
    });
    
    $scope.uploadPictures = function(files, user_id){
  	if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
		        url: '/users/' + user_id + '/pictures.json',
		        method: 'POST',
		        file: file,
		        fields: { 'user_id': user_id },
		        fileFormDataName: 'picture[file]',
		        formDataAppender: function(fd, key, val) {
		            if (angular.isArray(val)) {
		                angular.forEach(val, function(v) {
		                    fd.append('picture['+key+']', v);
		                });
		            } else {
		                fd.append('picture['+key+']', val);
		            }
		        }
		      }).progress(function (evt) {
                file.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data) {
            	pictures.addPicture({picture: {picture: data.picture}});
    			$scope.files.shift();
            });
        }
    }
  };
  
}]);


angular.module('boo-controllers').controller('FriendsCtrl', [
'$scope',
'users',
'Auth',
function($scope, users, Auth){
	Auth.currentUser().then(function (user){
    	$scope.current_user = user.user;
    });
    
    $scope.user = users.user.user;
	$scope.friends = users.friends;
	$scope.subscribers = users.subscribers;
	$scope.new_subscribers = users.new_subscribers;
	$scope.subscriptions = users.subscriptions;
	
	$scope.deleteFriend = users.deleteFriend;
	$scope.unsubscribe = users.unsubscribe;
	$scope.markReqViewed = users.markReqViewed;
	$scope.addFriend = users.addFriend;
}]);


angular.module('boo-controllers').controller('NavCtrl', [
'$scope',
'$rootScope',
'$state',
'Auth',
'mail',
'search',
'$interval',
function($scope, $rootScope, $state, Auth, mail, search, $interval){
	define_user = function (user){
		$scope.user = user.user;
	    if(typeof notify == 'undefined'){
	   	 notify = $interval(function(){
	   	 	mail.notify($scope.user.id, function(messages){$scope.new_messages = messages;});
	   	 	}, 1000);
	    }
	};
	
	cancel_notifications = function(){
	   $interval.cancel(notify);
       notify = undefined;
	};
	
	$scope.signedIn = Auth.isAuthenticated;
	
    $scope.logout = function(){
    	cancel_notifications();
    	Auth.logout().then(function(){
    		$state.go('login');
    	});
    };
    
    Auth.currentUser().then(function (user){
    	define_user(user);
    });
    
    $scope.$on('devise:new-registration', function (e, user){
    	define_user(user);
    });
	
    $scope.$on('devise:login', function (e, user){
    	define_user(user);
    });
	
	$scope.$on('devise:logout', function (e, user){
	   $scope.user = {};
       cancel_notifications();
	});
	
	$scope.search = function(){
		search.searchBy.phrase = $scope.searchBy;
		if (window.location.pathname.split("/").pop() == "search"){
			search.find(function(results){
				$rootScope.results = results;
			});
		}else{
			$state.go('search');
		}
		$scope.searchBy = "";
	};
}]);

angular.module('boo-controllers').controller('SearchCtrl', [
'$scope', '$rootScope',
'$state',
'Auth',
'search',
'videos',
function($scope, $rootScope, $state, Auth, search, videos){
	getPlaylist = function(){
		var songs = [];
		$scope.songs = search.results.songs;
		for (var counter = 0; counter < $scope.songs.length; counter ++){
			songs.push({title: $scope.songs[counter].title,
				        artist: $scope.songs[counter].performer,
			            mp3: $scope.songs[counter].url,
			            id: $scope.songs[counter].id,
			            likes: $scope.songs[counter].likers_count,
			            url: '/songs/' + $scope.songs[counter].id + '.json'});
		}
		return songs;
	};
	$scope.results = search.results;
	$scope.searchBy = search.searchBy;
	$scope.wrapPost = function(post){
		return {post: post};
	};
	
	$rootScope.$watch('results', function () {
        $scope.myPlaylist.setPlaylist(getPlaylist());
    });

	Auth.currentUser().then(function (user){
	    $scope.user = user.user;
	  }).then(function (){
	  	if (search.results.songs.length){
	  		var user_id = $scope.user.id;
			$scope.myPlaylist = new jPlayerPlaylist({
			  jPlayer: "#jquery_jplayer_2",
			  cssSelectorAncestor: "#jp_container_2"
			}, getPlaylist(), {
			  playlistOptions: {
			    enableRemoveControls: true,
			    enableDelete: false,
			    enableAdd: true,
			    current_user: user_id
			  },
			  supplied: "ogv, m4v, oga, mp3",
			  smoothPlayBar: true,
			  keyEnabled: true
			});
		}
	  });
	  
    $scope.video_tag = videos.video_tag;
}]);

angular.module('boo-controllers').controller('AudioCtrl', [
'$scope', 'Auth', 'audio', 'Upload',
function($scope, Auth, audio, Upload){
	$scope.songs = audio.songs;
	$scope.user_id = audio.user_id;
	Auth.currentUser().then(function (user){
	    $scope.user = user.user;
	  }).then(function (){
	  	
	  	var enableDelete = false;
	  	var enableAdd = true;
	  	var current_user_id = $scope.user.id;
	    if($scope.user.id == audio.user_id){
	    	enableDelete = true;
	    	enableAdd = false;
	    }
		
		$scope.myPlaylist = new jPlayerPlaylist({
		  jPlayer: "#jquery_jplayer_1",
		  cssSelectorAncestor: "#jp_container_1"
		}, songs, {
		  playlistOptions: {
		    enableRemoveControls: true,
		    enableDelete: enableDelete,
		    enableAdd: enableAdd,
		    current_user: current_user_id
		  },
		  supplied: "ogv, m4v, oga, mp3",
		  smoothPlayBar: true,
		  keyEnabled: true
		});
	  });
	
	var songs = [];
	for (var counter = 0; counter < $scope.songs.length; counter ++){
		songs.push({title: $scope.songs[counter].song.title,
			        artist: $scope.songs[counter].song.performer,
		            mp3: $scope.songs[counter].song.url,
				    likes: $scope.songs[counter].song.likers_count,
		            id: $scope.songs[counter].song.id,
		            url: '/songs/' + $scope.songs[counter].song.id + '.json'});
	}
	    
	$scope.$watch('files', function () {
        $scope.uploadSongs($scope.files);
    });
    
    $scope.updateSong = audio.updateSong;
	
    $scope.uploadSongs = function(files){
  	if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
		        url: '/songs.json',
		        method: 'POST',
		        file: file,
		        fileFormDataName: 'song[file]',
		        formDataAppender: function(fd, key, val) {
		            if (angular.isArray(val)) {
		                angular.forEach(val, function(v) {
		                    fd.append('song['+key+']', v);
		                });
		            } else {
		                fd.append('song['+key+']', val);
		            }
		        }
		      }).progress(function (evt) {
                file.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data) {
            	audio.addSong({song: data.song});
            	var tempPlaylistItems = $scope.myPlaylist.playlist;
            	tempPlaylistItems.unshift({title: data.song.title, 
            						       artist: data.song.performer, 
            						       mp3: data.song.url, 
				            			   likes: 0,
            						       id: data.song.id,
            						       url: '/songs/' + data.song.id + '.json'});
				$scope.myPlaylist.setPlaylist(tempPlaylistItems);
    			$scope.files.shift();
            });
        }
    }
  };
}]);

angular.module('boo-controllers').controller('AuthCtrl', [
'$scope',
'$state',
'Auth',
function($scope, $state, Auth){
  $scope.login = function() {
    Auth.login($scope.user).then(function(user){
      $state.go('userpage', {id: user.user.id});
    }, function(error) {
      $scope.errors = error.data.error;
    });
  };

  $scope.register = function() {
  	if($scope.password_confirmation != $scope.user.password){
  		$scope.errors = {custom: ["Passwords don't match."]};
  	}else if (!$('#t_and_c').is(':checked')){
  		$scope.errors = {custom: ["You should agree with terms and conditions."]};
  	}else{
	    Auth.register($scope.user).then(function(user){
	      $state.go('userpage', {id: user.user.id});
	    }, function(error) {
	      $scope.errors = error.data.errors;
	    });
	}
  };
}]);


angular.module('boo-controllers').controller('CommunitiesCtrl', [
'$scope', 'communities',
'$state',
'Auth',
function($scope, communities, $state, Auth){
  Auth.currentUser().then(function (user){
    	$scope.current_user = user.user;
    });
  $scope.signedIn = Auth.isAuthenticated;
  $scope.communities = communities.all;
  $scope.createCommunity = function(){
  	communities.create({title: $scope.title}, function(id){
	  	$scope.title = "";
	  	$state.go('community', {id: id});
  	});
  };
}]);


angular.module('boo-controllers').controller('CommunityCtrl', [
'$scope', 'communities', 'Notification',
'$state',
'Auth',
function($scope, communities, Notification, $state, Auth){
  Auth.currentUser().then(function (user){
    	$scope.current_user = user;
    });
  $scope.signedIn = Auth.isAuthenticated;
  $scope.community = communities.current;
  $scope.join = function(){
  	communities.join($scope.current_user);
  	Notification.success("Now You are member of " + $scope.community.community.community.title);
  };
  $scope.leave = function(){
  	communities.leave($scope.current_user);
  	Notification.success("You left " + $scope.community.community.community.title);
  };
  
}]);

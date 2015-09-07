//= require jquery
//= require jquery_ujs
//= require twitter/bootstrap
//= require angular
//= require angular-rails-templates
//= require angular-devise
//= require angular-ui-router
//= require angular-route
//= require angular-bootstrap
//= require angular-touch
//= require ng-tags-input
//= require angular-loading-bar
//= require angular-xeditable
//= require ng-file-upload-shim
//= require ng-file-upload
//= require Buttons
//= require x-editable
//= require angular-ui-notification
//= require_tree ../templates
//= require_tree .

angular.module('boo', ['boo-factories', 'boo-controllers', 'ui-notification', 'ngTagsInput', 'angular-loading-bar', 'ui.router', 'ui.bootstrap', 'templates', 'Devise', 'ngFileUpload', 'xeditable', 'bootstrapLightbox']);


function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

angular.module('boo').run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});

angular.module('boo').config(function(NotificationProvider) {
        NotificationProvider.setOptions({
            startTop: 55,
            positionX: 'center'
        });
    });

angular.module('boo').config([
  "$httpProvider", function($httpProvider) {
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    $httpProvider.defaults.withCredentials = true;
  }
]);

angular.module('boo').config(function (LightboxProvider) {
  LightboxProvider.templateUrl = 'lightboxGallery.html';
  LightboxProvider.getImageUrl = function (picture) {
    return picture.picture.picture.url;
  };
});

angular.module('boo').config([
'$stateProvider',
'$urlRouterProvider',
'$locationProvider',
function($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/");
  $stateProvider
  	.state('home', {
	      url: '/',
	      templateUrl: 'index.html',
	        controller: 'HomeCtrl'
	    })
	 .state('userpage', {
	      url: '/id:id',
	      templateUrl: 'users/userpage.html',
	        controller: 'UserpageCtrl',
	        resolve: {
	          postPromise: ['$stateParams', 'posts', function($stateParams, posts) {
			    return posts.getUsersPosts($stateParams.id);
			  }],
			  user: ['$stateParams', 'users', function($stateParams, users) {
			    return users.getUser($stateParams.id);
			  }],
			  media: ['$stateParams', 'users', function($stateParams, users) {
			    return users.getUserpageMedia($stateParams.id);
			  }]
			}
	    })
	.state('mail', {
	      url: '/mail',
	      templateUrl: 'mail/index.html',
	        controller: 'MailCtrl',
	        resolve: {
			  postPromise: ['Auth', 'mail', 'users', function(Auth, mail, users) {
			  	Auth.currentUser().then(function (user){
		          mail.getUsersDialogues(user.user.id);
		          users.getUser(user.user.id);
		        }, function(error) {
		          $state.go('login');
		        });
			  }]
			}
	    })
	.state('communities', {
	      url: '/communities',
	      templateUrl: 'communities/index.html',
	        controller: 'CommunitiesCtrl',
	        resolve: {
			  postPromise: ['communities', function(communities) {
			  	return communities.getAll();
			  }]
			}
	    })
	.state('community', {
	      url: '/communities/:id',
	      templateUrl: 'communities/community.html',
	        controller: 'CommunityCtrl',
	        resolve: {
			  postPromise: ['$stateParams', 'communities', function($stateParams, communities) {
			  	return communities.get($stateParams.id);
			  }]
			}
	    })
	.state('myCommunities', {
	      url: '/id:id/communities',
	      templateUrl: 'communities/myCommunities.html',
	        controller: 'CommunitiesCtrl',
	        resolve: {
			  postPromise: ['$stateParams', 'communities', function($stateParams, communities) {
			  	return communities.getUsers($stateParams.id);
			  }]
			}
	    })
	.state('dialogue', {
	      url: '/mail/dialogue:dialogue_id',
	      templateUrl: 'mail/dialogue.html',
	        controller: 'DialogueCtrl',
	        resolve: {
			  postPromise: ['$stateParams', 'Auth', 'users', 'mail', function($stateParams, Auth, users, mail) {
			  	Auth.currentUser().then(function (user){
				  	mail.getUsersDialogue(user.user.id, $stateParams.dialogue_id);
				    users.getUser(user.user.id);
		        }, function(error) {
		            $state.go('login');
		        });
			  }]
			}
	    })
	.state('edit_profile', {
	      url: '/edit_profile',
	      templateUrl: 'users/edit.html',
	        controller: 'EditCtrl',
	        resolve: {
	          postPromise: ['Auth', 'users', function(Auth, users) {
			  	Auth.currentUser().then(function (user){},
				  	function(error) {
			          $state.go('login');
			        }
			    );
			  }]
			}
	    })
	.state('search', {
	      url: '/search',
	      templateUrl: 'search/search.html',
	      controller: 'SearchCtrl',
	      resolve: {
			  postPromise: ['$stateParams', 'search', '$rootScope', function($stateParams, search, $rootScope) {
			    return search.find();
			  }]
			}
	    })
    .state('friends', {
      url: '/id:id/friends',
      templateUrl: 'friends/_index.html',
      controller: 'FriendsCtrl',
      resolve: {
      	  user: ['$stateParams', 'users', function($stateParams, users) {
		    return users.getUser($stateParams.id);
		  }],
		  friends: ['$stateParams', 'users', function($stateParams, users) {
		    return users.getUsersFriends($stateParams.id);
		  }]
		}
    })
    .state('pictures', {
      url: '/id:id/pictures',
      templateUrl: 'pictures/index.html',
      controller: 'PicturesCtrl',
      resolve: {
		  postPromise: ['$stateParams', 'pictures', function($stateParams, pictures) {
		    return pictures.getUsersPictures($stateParams.id);
		  }]
		}
    })
    .state('music', {
      url: '/id:id/audio',
      templateUrl: 'audio/index.html',
      controller: 'AudioCtrl',
      resolve: {
		  postPromise: ['$stateParams', 'audio', function($stateParams, audio) {
		    return audio.getUsersSongs($stateParams.id);
		  }]
		}
    })
    .state('video', {
      url: '/id:id/video',
      templateUrl: 'video/index.html',
      controller: 'VideoCtrl',
      resolve: {
		  postPromise: ['$stateParams', 'videos', function($stateParams, videos) {
		    return videos.getUsersVideos($stateParams.id);
		  }]
		}
    })
    .state('subscribers', {
      url: '/id:id/subscribers',
      templateUrl: 'friends/_subscribers.html',
      controller: 'FriendsCtrl',
      resolve: {
      	  user: ['$stateParams', 'users', function($stateParams, users) {
		    return users.getUser($stateParams.id);
		  }],
		  friends: ['$stateParams', 'users', function($stateParams, users) {
		    return users.getUsersFriends($stateParams.id);
		  }]
		}
    })
    .state('new_subscribers', {
      url: '/id:id/new_subscribers',
      templateUrl: 'friends/_new_subscribers.html',
      controller: 'FriendsCtrl',
      resolve: {
      	  user: ['$stateParams', 'users', function($stateParams, users) {
		    return users.getUser($stateParams.id);
		  }],
		  friends: ['$stateParams', 'users', function($stateParams, users) {
		    return users.getUsersFriends($stateParams.id);
		  }]
		}
    })
    .state('subscriptions', {
      url: '/id:id/subscriptions',
      templateUrl: 'friends/_subscriptions.html',
      controller: 'FriendsCtrl',
      resolve: {
      	  user: ['$stateParams', 'users', function($stateParams, users) {
		    return users.getUser($stateParams.id);
		  }],
		  friends: ['$stateParams', 'users', function($stateParams, users) {
		    return users.getUsersFriends($stateParams.id);
		  }]
		}
    })
    .state('login', {
      url: '/login',
      templateUrl: 'login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'Auth', function($state, Auth) {
        Auth.currentUser().then(function (){
          $state.go('home');
        });
      }]
    })
    .state('register', {
      url: '/register',
      templateUrl: 'register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'Auth', function($state, Auth) {
        Auth.currentUser().then(function (){
          $state.go('home');
        });
      }]
    });
}]);

angular.module('boo').directive('userPanel', function() { 
  return { 
    restrict: 'E', 
    scope: { 
      user: '=' 
    }, 
    templateUrl: 'users/_user.html' 
  }; 
});

angular.module('boo').directive('postPanel', function() { 
  return { 
    restrict: 'E', 
    scope: { 
      post: '=',
      current_user: "="
    }, 
    templateUrl: 'posts/_index.html' 
  }; 
});

angular.module('boo').config(function($httpProvider){
  var interceptor = function($q, $location, $rootScope) {
    return {
      'responseError': function(rejection) {
        if (rejection.status == 401) {
        	if($location.path() != "/register"){
	            $rootScope.$broadcast('event:unauthorized');
	         	$location.path('/login');
	         }
        }
        else if (rejection.status == 403) {
            $rootScope.$broadcast('event:unauthorized');
         	$location.path('/login');
        }
        $httpProvider.defaults.headers.common['X-CSRF-Token'] = getCookie("XSRF-TOKEN");
		return $q.reject(rejection);     
      }
    };
  };
  $httpProvider.interceptors.push(interceptor);
});
angular.module('bootstrapLightbox', [
  'ui.bootstrap', 'boo'
]);

// optional dependencies
try {
  angular.module('angular-loading-bar');
  angular.module('bootstrapLightbox').requires.push('angular-loading-bar');
} catch (e) {}

try {
  angular.module('ngTouch');
  angular.module('bootstrapLightbox').requires.push('ngTouch');
} catch (e) {}
angular.module('bootstrapLightbox').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('lightbox.html',
    "<div class=modal-body ng-swipe-left=Lightbox.nextImage() ng-swipe-right=Lightbox.prevImage()><div class=lightbox-nav><button class=close aria-hidden=true ng-click=$dismiss()>×</button><div class=btn-group><a class=\"btn btn-xs btn-default\" ng-click=Lightbox.prevImage()>‹ Previous</a> <a ng-href={{Lightbox.imageUrl}} target=_blank class=\"btn btn-xs btn-default\" title=\"Open in new tab\">Open image in new tab</a> <a class=\"btn btn-xs btn-default\" ng-click=Lightbox.nextImage()>Next ›</a></div></div><div class=lightbox-image-container><div class=lightbox-image-caption><span>{{Lightbox.imageCaption}}</span></div><img lightbox-src={{Lightbox.imageUrl}} alt=\"\"></div>{{Lightbox.deleteUrl}}</div>"
  );

}]);

angular.module('bootstrapLightbox').service('ImageLoader', ['$q',
    function ($q) {

  this.load = function (url) {
    var deferred = $q.defer();

    var image = new Image();

    // when the image has loaded
    image.onload = function () {
      // check image properties for possible errors
      if ((typeof this.complete === 'boolean' && this.complete === false) ||
          (typeof this.naturalWidth === 'number' && this.naturalWidth === 0)) {
        deferred.reject();
      }

      deferred.resolve(image);
    };

    // when the image fails to load
    image.onerror = function () {
      deferred.reject();
    };

    // start loading the image
    image.src = url;

    return deferred.promise;
  };
}]);

angular.module('bootstrapLightbox').provider('Lightbox', function () {

  this.templateUrl = 'lightbox.html';

  this.getImageUrl = function (image) {
    return image.picture.url;
  };

  this.getImageCaption = function (image) {
    return image.caption;
  };

  this.calculateImageDimensionLimits = function (dimensions) {
    if (dimensions.windowWidth >= 768) {
      return {
        // 92px = 2 * (30px margin of .modal-dialog
        //             + 1px border of .modal-content
        //             + 15px padding of .modal-body)
        // with the goal of 30px side margins; however, the actual side margins
        // will be slightly less (at 22.5px) due to the vertical scrollbar
        'maxWidth': dimensions.windowWidth - 92,
        // 126px = 92px as above
        //         + 34px outer height of .lightbox-nav
        'maxHeight': dimensions.windowHeight - 126
      };
    } else {
      return {
        // 52px = 2 * (10px margin of .modal-dialog
        //             + 1px border of .modal-content
        //             + 15px padding of .modal-body)
        'maxWidth': dimensions.windowWidth - 52,
        // 86px = 52px as above
        //        + 34px outer height of .lightbox-nav
        'maxHeight': dimensions.windowHeight - 86
      };
    }
  };

  this.calculateModalDimensions = function (dimensions) {
    // 400px = arbitrary min width
    // 32px = 2 * (1px border of .modal-content
    //             + 15px padding of .modal-body)
    var width = Math.max(400, dimensions.imageDisplayWidth + 32);

    // 200px = arbitrary min height
    // 66px = 32px as above
    //        + 34px outer height of .lightbox-nav
    var height = Math.max(200, dimensions.imageDisplayHeight + 66);

    // first case:  the modal width cannot be larger than the window width
    //              20px = arbitrary value larger than the vertical scrollbar
    //                     width in order to avoid having a horizontal scrollbar
    // second case: Bootstrap modals are not centered below 768px
    if (width >= dimensions.windowWidth - 20 || dimensions.windowWidth < 768) {
      width = 'auto';
    }

    // the modal height cannot be larger than the window height
    if (height >= dimensions.windowHeight) {
      height = 'auto';
    }

    return {
      'width': width,
      'height': height
    };
  };

  this.$get = ['$document', '$injector', '$modal', '$timeout', 'ImageLoader', 'pictures', 'Auth', 'comments', 'likes', 'tags', 'Notification',
      function ($document, $injector, $modal, $timeout, ImageLoader, pictures, Auth, comments, likes, tags, Notification) {
    // optional dependency
    var cfpLoadingBar = $injector.has('cfpLoadingBar') ?
      $injector.get('cfpLoadingBar'): null;

    var Lightbox = {};

    Lightbox.images = [];

    Lightbox.index = -1;

    // set the configurable properties and methods, the defaults of which are
    // defined above
    Lightbox.templateUrl = this.templateUrl;
    Lightbox.getImageUrl = this.getImageUrl;
    Lightbox.getImageCaption = this.getImageCaption;
    Lightbox.calculateImageDimensionLimits = this.calculateImageDimensionLimits;
    Lightbox.calculateModalDimensions = this.calculateModalDimensions;

    Lightbox.keyboardNavEnabled = false;
    Lightbox.image = {};
	
    Lightbox.modalInstance = null;
    
    Lightbox.openModal = function (newImages, newIndex) {
      Lightbox.images = newImages;
      Lightbox.setImage(newIndex);

      // store the modal instance so we can close it manually if we need to
      Lightbox.modalInstance = $modal.open({
        'templateUrl': Lightbox.templateUrl,
        'controller': ['$scope', function ($scope) {
          // $scope is the modal scope, a child of $rootScope
          $scope.Lightbox = Lightbox;
		  
          Lightbox.keyboardNavEnabled = true;
        }],
        'windowClass': 'lightbox-modal'
      });

      // modal close handler
      Lightbox.modalInstance.result['finally'](function () {
        // prevent the lightbox from flickering from the old image when it gets
        // opened again
        Lightbox.images = [];
        Lightbox.index = 1;
        Lightbox.image = {};
        Lightbox.imageUrl = null;
        Lightbox.imageCaption = null;

        Lightbox.keyboardNavEnabled = false;

        // complete any lingering loading bar progress
        if (cfpLoadingBar) {
          cfpLoadingBar.complete();
        }
      });

      return Lightbox.modalInstance;
    };


    Lightbox.closeModal = function (result) {
      return Lightbox.modalInstance.close(result);
    };

	Lightbox.deletePicture = function(){
		if(Lightbox.images.length != 1){
			Lightbox.nextImage();
		}else{
			Lightbox.modalInstance.close();
		}
		pictures.deletePicture(Lightbox.picture.picture);
		Notification.success("Picture deleted");
	};
	
	Lightbox.addComment = function(){
		comments.addComment(Lightbox.picture.picture.picture.id, Lightbox.picture.picture, Lightbox.comment, "picture", function(comment){
			Lightbox.picture.root_comments.push(comment);
		});
		Lightbox.comment = "";
	};
	
	Lightbox.loadTags = tags.load;
	Lightbox.addTag = function(tag){
    	tags.addTag(tag, "picture", Lightbox.picture.picture.picture.id);
    };
	Lightbox.deleteTag = function(tag){
    	tags.deleteTag(tag, "picture", Lightbox.picture.picture.picture.id);
    };
	
	Lightbox.like = function(){
		likes.like(Lightbox.picture, "picture", function(increment){
			if(increment){
				Lightbox.picture.picture.picture.likers_count ++;
			}else{
				Lightbox.picture.picture.picture.likers_count --;
			}
		});
	};
	
	Lightbox.deleteComment = function(comment){
		comments.deleteComment(Lightbox.picture.picture.picture, comment, "picture");
		var comment_index = Lightbox.picture.root_comments.indexOf(comment);
		Lightbox.picture.root_comments.splice(comment_index, 1);
	};
	
	Lightbox.setAvatar = function(){
		pictures.setAvatar(Lightbox.picture.picture.picture);
		Notification.success("Avatar updated");
	};
	
    Lightbox.setImage = function (newIndex) {
      if (!(newIndex in Lightbox.images)) {
        throw 'Invalid image.';
      }

      // start the loading bar
      if (cfpLoadingBar) {
        cfpLoadingBar.start();
      }

      var success = function () {
        Lightbox.index = newIndex;
        Lightbox.image = Lightbox.images[Lightbox.index];

        // complete the loading bar
        if (cfpLoadingBar) {
          cfpLoadingBar.complete();
        }
      };
	  
	  var picture = Lightbox.images[newIndex];
      var imageUrl = Lightbox.getImageUrl(Lightbox.images[newIndex]);

      ImageLoader.load(imageUrl).then(function () {
        success();
		
		Auth.currentUser().then(function (user){
			Lightbox.current_user_id = user.user.id;
	    });
	    
		Lightbox.picture = picture;
        Lightbox.imageUrl = imageUrl;
        Lightbox.imageCaption = Lightbox.getImageCaption(Lightbox.image);
      }, function () {
        success();

        // blank image
        Lightbox.imageUrl = '//:0';
        // use the caption to show the user an error
        Lightbox.imageCaption = 'Failed to load image';
      });
    };

    Lightbox.firstImage = function () {
      Lightbox.setImage(0);
    };

    Lightbox.prevImage = function () {
      Lightbox.setImage((Lightbox.index - 1 + Lightbox.images.length) %
        Lightbox.images.length);
    };

    Lightbox.nextImage = function () {
      Lightbox.setImage((Lightbox.index + 1) % Lightbox.images.length);
    };

    Lightbox.lastImage = function () {
      Lightbox.setImage(Lightbox.images.length - 1);
    };

    Lightbox.setImages = function (newImages) {
      Lightbox.images = newImages;
      Lightbox.setImage(Lightbox.index);
    };

    // Bind the left and right arrow keys for image navigation. This event
    // handler never gets unbinded. Disable this using the `keyboardNavEnabled`
    // flag. It is automatically disabled when the target is an input and or a
    // textarea. TODO: Move this to a directive.
    $document.bind('keydown', function (event) {
      if (!Lightbox.keyboardNavEnabled) {
        return;
      }

      // method of Lightbox to call
      var method = null;

      switch (event.which) {
      case 39: // right arrow key
        method = 'nextImage';
        break;
      case 37: // left arrow key
        method = 'prevImage';
        break;
      }

      if (method !== null && ['input', 'textarea'].indexOf(
          event.target.tagName.toLowerCase()) === -1) {
        // the view doesn't update without a manual digest
        $timeout(function () {
          Lightbox[method]();
        });

        event.preventDefault();
      }
    });

    return Lightbox;
  }];
});

angular.module('bootstrapLightbox').directive('lightboxSrc', ['$window',
    'ImageLoader', 'Lightbox', function ($window, ImageLoader, Lightbox) {
  // Calculate the dimensions to display the image. The max dimensions override
  // the min dimensions if they conflict.
  var calculateImageDisplayDimensions = function (dimensions) {
    var w = dimensions.width;
    var h = dimensions.height;
    var minW = dimensions.minWidth;
    var minH = dimensions.minHeight;
    var maxW = dimensions.maxWidth;
    var maxH = dimensions.maxHeight;

    var displayW = w;
    var displayH = h;

    // resize the image if it is too small
    if (w < minW && h < minH) {
      // the image is both too thin and short, so compare the aspect ratios to
      // determine whether to min the width or height
      if (w / h > maxW / maxH) {
        displayH = minH;
        displayW = Math.round(w * minH / h);
      } else {
        displayW = minW;
        displayH = Math.round(h * minW / w);
      }
    } else if (w < minW) {
      // the image is too thin
      displayW = minW;
      displayH = Math.round(h * minW / w);
    } else if (h < minH) {
      // the image is too short
      displayH = minH;
      displayW = Math.round(w * minH / h);
    }

    // resize the image if it is too large
    if (w > maxW && h > maxH) {
      // the image is both too tall and wide, so compare the aspect ratios
      // to determine whether to max the width or height
      if (w / h > maxW / maxH) {
        displayW = maxW;
        displayH = Math.round(h * maxW / w);
      } else {
        displayH = maxH;
        displayW = Math.round(w * maxH / h);
      }
    } else if (w > maxW) {
      // the image is too wide
      displayW = maxW;
      displayH = Math.round(h * maxW / w);
    } else if (h > maxH) {
      // the image is too tall
      displayH = maxH;
      displayW = Math.round(w * maxH / h);
    }

    return {
      'width': displayW || 0,
      'height': displayH || 0 // NaN is possible when dimensions.width is 0
    };
  };

  // the dimensions of the image
  var imageWidth = 0;
  var imageHeight = 0;

  return {
    'link': function (scope, element, attrs) {
      // resize the img element and the containing modal
      var resize = function () {
        // get the window dimensions
        var windowWidth = $window.innerWidth;
        var windowHeight = $window.innerHeight;

        // calculate the max/min dimensions for the image
        var imageDimensionLimits = Lightbox.calculateImageDimensionLimits({
          'windowWidth': windowWidth,
          'windowHeight': windowHeight,
          'imageWidth': imageWidth,
          'imageHeight': imageHeight
        });

        // calculate the dimensions to display the image
        var imageDisplayDimensions = calculateImageDisplayDimensions(
          angular.extend({
            'width': imageWidth,
            'height': imageHeight,
            'minWidth': 1,
            'minHeight': 1,
            'maxWidth': 3000,
            'maxHeight': 3000,
          }, imageDimensionLimits)
        );

        // calculate the dimensions of the modal container
        var modalDimensions = Lightbox.calculateModalDimensions({
          'windowWidth': windowWidth,
          'windowHeight': windowHeight,
          'imageDisplayWidth': imageDisplayDimensions.width,
          'imageDisplayHeight': imageDisplayDimensions.height
        });

        // resize the image
        element.css({
          'width': imageDisplayDimensions.width + 'px',
          'height': imageDisplayDimensions.height + 'px'
        });

        // setting the height on .modal-dialog does not expand the div with the
        // background, which is .modal-content
        angular.element(
          document.querySelector('.lightbox-modal .modal-dialog')
        ).css({
          'width': modalDimensions.width + 'px'
        });

        // .modal-content has no width specified; if we set the width on
        // .modal-content and not on .modal-dialog, .modal-dialog retains its
        // default width of 600px and that places .modal-content off center
        angular.element(
          document.querySelector('.lightbox-modal .modal-content')
        ).css({
          'height': modalDimensions.height + 'px'
        });
      };

      // load the new image whenever the attr changes
      scope.$watch(function () {
        return attrs.lightboxSrc;
      }, function (src) {
        // blank the image before resizing the element; see
        // http://stackoverflow.com/questions/5775469
        element[0].src = '//:0';

        ImageLoader.load(src).then(function (image) {
          // these variables must be set before resize(), as they are used in it
          imageWidth = image.naturalWidth;
          imageHeight = image.naturalHeight;

          // resize the img element and the containing modal
          resize();

          // show the image
          element[0].src = src;
        });
      });

      // resize the image and modal whenever the window gets resized
      angular.element($window).on('resize', resize);
    }
  };
}]);

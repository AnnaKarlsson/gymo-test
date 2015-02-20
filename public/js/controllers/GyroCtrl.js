angular.module('GyroCtrl', [])/*
.controller('CompassController', function($scope) {
	$scope.init = function() {
      $scope.compass = document.getElementById('compassContainer');

      if(window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
          var dir='';
          var alpha;
          //Check for iOS property
          if(event.webkitCompassHeading) {
            alpha = event.webkitCompassHeading;
            //Direction is reversed for iOS
            dir='-';
          }
          else alpha = event.alpha;
          $scope.compass.style.Transform = 'rotate(' + alpha + 'deg)';
          $scope.compass.style.WebkitTransform = 'rotate('+ dir + alpha + 'deg)';
          $scope.compass.style.MozTransform = 'rotate(-' + alpha + 'deg)'; 
        }  , false);
      }
    }
    
})*/

.controller('GyroController', function($scope){
  var count = 0;
  var tiltLR, tiltFB, direction, dir;
  $scope.event = "";
    if (window.DeviceOrientationEvent) {
      $scope.event = "DeviceOrientation";
      // Listen for the deviceorientation event and handle the raw data
      window.addEventListener('deviceorientation', function(event) {
        tiltLR = event.gamma;
        tiltFB = event.beta;
        direction = event.alpha;
        dir='';
        //Check for iOS property
        if(event.webkitCompassHeading) {
          direction = event.webkitCompassHeading;
          //Direction is reversed for iOS
          dir='-';
        }
        else direction = event.alpha;
        // call our orientation event handler
        $scope.deviceOrientationHandler(tiltLR, tiltFB, direction, dir);
      }, false);
    } else {
      $scope.event = "Not supported.";
    }

  $scope.deviceOrientationHandler = function(tiltLR, tiltFB, direction, dir){
    $scope.tiltFB = tiltFB;
    $scope.tiltLR = tiltLR;
    $scope.direction = dir+direction;
    // Apply the transform to the image
    $scope.arrow = document.getElementById("compassContainer");
    $scope.arrow.style.webkitTransform ="rotate("+ $scope.tiltLR +"deg) rotate3d(1,0,0, "+ ($scope.tiltFB*-1)+"deg)";
    $scope.arrow.style.MozTransform = "rotate("+ $scope.tiltLR +"deg)";
    $scope.arrow.style.transform = "rotate("+ $scope.tiltLR +"deg) rotate3d(1,0,0, "+ ($scope.tiltFB*-1)+"deg)";
    $scope.$digest();
  }

})
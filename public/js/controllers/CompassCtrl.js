angular.module('CompassCtrl', [])
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
          $scope.compass.style.WebkitTransform = 'rotate('+dir + alpha + 'deg)';
          $scope.compass.style.MozTransform = 'rotate(-' + alpha + 'deg)'; 
        }  , false);
      }
    }
    
})
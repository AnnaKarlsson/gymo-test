angular.module('MotionCtrl', ['ngSanitize'])
.controller('MotionController', function($scope) {
  /* Motion listener */
  if(window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function(event) {
      if(event.acceleration){
        accX = event.acceleration.x;
        accY = event.acceleration.y;
        accZ = event.acceleration.z; 
        accR = event.rotationRate;
      }else if(event.accelerationIncludingGravity) {
        accX = event.accelerationIncludingGravity.x;
        accY = event.accelerationIncludingGravity.y;
        accZ = event.accelerationIncludingGravity.z;
        accR = event.rotationRate;
      }
      $scope.motionUpdate(accX, accY, accZ, accR);
      if ((accR.alpha).toFixed(1) == 0 && (accR.beta).toFixed(1) == 0 && (accR.gamma).toFixed(1) == 0){
        isStill = true;
      } // iOS don't support rotationRate
      else if(Math.abs(accX) < 1 && Math.abs(accY) < 1){
        isStill = true;
      }else isStill = false;
    });
  }

  $scope.motionUpdate = function(X, Y, Z, R){
    $scope.accX = X;
    $scope.accY = Y;
    $scope.accZ = Z;
    $scope.accR = R;
  }
});
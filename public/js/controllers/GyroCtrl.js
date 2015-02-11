angular.module('GyroCtrl', []).controller('GyroController', function($scope) {

  $scope.tagline = 'Instable!';
  $scope.alpha = 'steady,';
  $scope.beta = 'steady,';
  $scope.gamma = 'steady...';

  $scope.testGyro = function(){
    if(window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', function(event) {
        if(event.alpha!=null || event.beta!=null || event.gamma!=null){ 
          $scope.alpha = event.alpha;
          $scope.beta = event.beta;
	        $scope.gamma = event.gamma;
        }
      }, false);
	  }
  };

    $scope.recordGyro = function(){
    if(window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', function(event) {
        if(event.alpha!=null || event.beta!=null || event.gamma!=null){
          
        }
      }, false);
    }
  };

});
angular.module('GyroCtrl', ['ngSanitize', 'ngCsv'])
.controller('GyroController', function($scope, $timeout, $interval) {

  $scope.tagline = 'Instable!';
  $scope.recBtnTxt = 'Record orientation';
  $scope.measurements = [];
  var measureIntervall = 1; //ms
  var nbrOfMeaurements = 1000; 
  var mytimeout = $timeout($scope.onCountdown,measureIntervall);
  /*Total time of measurements will be measureIntervall * nbrOfMeasurements in ms*/
  
  if(window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(event) {
      if(event.alpha!=null || event.beta!=null || event.gamma!=null){ 
        $scope.alpha = event.alpha;
        $scope.beta = event.beta;
	      $scope.gamma = event.gamma;
      }
    }, false);
	}
  

  $scope.recordGyro = function(){
    $scope.measurements = [];
    $scope.isDisabled = true;
    $scope.counter = nbrOfMeaurements;
    $scope.recBtnTxt = 'Recording ';
    mytimeout = $timeout($scope.onCountdown,measureIntervall);
  };

  $scope.onCountdown = function(){
    $scope.counter--;
    $scope.recBtnTxt = "Recording "+$scope.sampleProgress+"%";
    $scope.sampleProgress = Math.ceil(100*((1-($scope.counter / nbrOfMeaurements))));
    $scope.isDisabled = true;
    $scope.measurements.push({'alpha': $scope.alpha, 'beta': $scope.beta, 'gamma':$scope.gamma});
    if ($scope.counter > 0) {
      mytimeout = $timeout($scope.onCountdown,measureIntervall);
    }else{
      $scope.recBtnTxt = 'Record orientation';
      $scope.isDisabled = false;
      $scope.$apply();
    }
  };

  // CSV download stuff
  $scope.getArray = $scope.measurements;
  $scope.getHeader = function () {return ["Alpha", "Beta", "Gamma"]};
  $scope.clickFn = function() {
    console.log("downloading gyro data as CSV");
  };

  
  

});
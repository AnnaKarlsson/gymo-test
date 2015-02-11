// Locals
var motionCtrl = angular.module('MotionCtrl', ['ngSanitize', 'ngCsv']);

motionCtrl.controller('MotionController', function($scope, $timeout, $interval) {

  $scope.tagline = 'Never standing still';
  $scope.valueX = 'still,';
  $scope.valueY = 'still,';
  $scope.valueZ = 'still...';

  $scope.counter = 0;
  $scope.rMessage = "Record motion";
  var rec = "Recording ";
  var sec = " samples left";
  $scope.measurements = [];

  if(window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function(event) {

      if(event.accelerationIncludingGravity) {
        $scope.valueX = event.accelerationIncludingGravity.x;
        $scope.valueY = event.accelerationIncludingGravity.y;
        $scope.valueZ = event.accelerationIncludingGravity.z;

      }
      else if(event.acceleration) {
        $scope.valueX = event.acceleration.x;
        $scope.valueY = event.acceleration.y;
        $scope.valueZ = event.acceleration.z;
      }
    });
  }
  

  $scope.testMotion = function(){
    if(window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', function(event) {

        if(event.accelerationIncludingGravity) {
          $scope.valueX = event.accelerationIncludingGravity.x;
          $scope.valueY = event.accelerationIncludingGravity.y;
          $scope.valueZ = event.accelerationIncludingGravity.z;

        }
        else if(event.acceleration) {
          $scope.valueX = event.acceleration.x;
          $scope.valueY = event.acceleration.y;
          $scope.valueZ = event.acceleration.z;
        }
      });
    }
  };

  var measureIntervall = 1; //ms
  var nbrOfMeaurements = 500; 
  /*Total time of measurements will be measureIntervall * nbrOfMeasurements in ms*/
  $scope.onCountdown = function(){
    $scope.counter--;
    $scope.rMessage = rec+$scope.counter+sec;
    $scope.isDisabled = true;
    newX = $scope.valueX;
    newY = $scope.valueY;
    newZ = $scope.valueZ;
    $scope.measurements.push({'vX': newX, 'vY': newY, 'vZ':newZ});
    if ($scope.counter > 0) {
      mytimeout = $timeout($scope.onCountdown,measureIntervall);
    }else{
      $scope.rMessage = "Record motion";
      $scope.isDisabled = false;
      $scope.$apply();
    }
  };
  var mytimeout = $timeout($scope.onCountdown,measureIntervall);
    
  $scope.recordMotion= function(){
    $scope.isDisabled = true;
    $scope.counter = nbrOfMeaurements;
    $scope.rMessage = "Recording...";
    mytimeout = $timeout($scope.onCountdown,measureIntervall);
  };

  // CSV download stuff
  $scope.getArray = $scope.measurements;
  $scope.getHeader = function () {return ["X", "Y", "Z"]};
  $scope.clickFn = function() {
    console.log("downloading motion data as CSV");
  };

});

function calcDeltaDist(){
  deltaDist =[];
  for (var i = 0; i < measure.length; i++) {
    deltaDist[i] = Math.sqrt(pow(xValArray[i],2)+pow(yValArray[i],2)+pow(yValArray[i],2));
  };
}

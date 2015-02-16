// Locals
var motionCtrl = angular.module('MotionCtrl', ['mediaPlayer','ngSanitize', 'ngCsv']);
var nX, nY, nZ;
var alert;

var measureIntervall = 1; //ms
var nbrOfMeaurements = 1000; 


motionCtrl.controller('MotionController', function($scope, $timeout, $interval) {
  console.log('isRecDone: '+$scope.isRecDone);
  $scope.tagline = 'Never standing still';
  $scope.recBtnTxt = "Record motion";
  
  $scope.measurements = [];
  $scope.sampleProgress = 0;
  $scope.isRecDone;
  /*Total time of measurements will be measureIntervall * nbrOfMeasurements in ms*/

  if(window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function(event) {
      if(event.acceleration) {
        nX = event.acceleration.x;
        nY = event.acceleration.y;
        nZ = event.acceleration.z;
      }
    });
  }

  /*NOTE X; -0.4:1.2, Y;-0.2:0.25, Z: 9.6-10 (Apple; -9.98:-9.82, Android; 9.6:10 */
  $scope.onCountdown = function(){
    if ($scope.counter > 0) {
      $scope.counter--;
      $scope.sampleProgress = Math.ceil(100*((1-($scope.counter / nbrOfMeaurements))));
      $scope.recBtnTxt = "Recording 1: "+$scope.sampleProgress+"%";

      $scope.measurements.push({'vX': nX, 'vY': nY, 'vZ': nZ});
      mytimeout = $timeout($scope.onCountdown,measureIntervall);
    }else{
      console.log('in else... : '+$scope.recBtnTxt)
      if($scope.recBtnTxt == "Recording 1: 100%"){
        $scope.isRecDone = true;
        console.log('Done 1st rec!!');
        console.log('isRecDone: '+$scope.isRecDone);
        $scope.$apply();
      }
    }
    $scope.$apply();
}

  var mytimeout = $timeout($scope.onCountdown,measureIntervall);
    
  $scope.recordMotion= function(){
    if (nX == undefined) {
      $scope.alerts = [ {msg : 'Device motion not supported'}];
    }else if(isStill()){
      isRecDone = false;
      $scope.measurements = [];
      $scope.isDisabled = true;
      $scope.counter = nbrOfMeaurements;
      $scope.rMessage = "Recording ";
      mytimeout = $timeout($scope.onCountdown,measureIntervall);
    }else{
      $scope.alerts = [{msg : 'Put your device on a flat surface'}];
    }
  };

  // CSV download stuff
  $scope.getArray = $scope.measurements;
  $scope.getHeader = function () {return ["X", "Y", "Z"]};
  $scope.clickFn = function() {
    console.log("downloading motion data as CSV");
  };

  $scope.alerts = [];

  $scope.addAlert = function(alertMsg) {
    $scope.alerts.push({msg: alertMsg});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
  
});

function isStill(){
  var x1 = Math.floor(nX);
  var y1 = Math.floor(nY);
  var z1 = Math.floor(nZ);
  console.log('xyz1: '+x1+', '+y1+', '+z1);
  sleep(500);
  var x2 = Math.floor(nX);
  var y2 = Math.floor(nY);
  var z2 = Math.floor(nZ);
  console.log('xyz2: '+x2+', '+y2+', '+z2);
  if (x1 == x2 && y1 == y2 && z1 == z2) {
    return true;
  }else{
    return false;
  }
  
  
}
function sleep(millisecs){
  setTimeout(function() {
        console.log('sleeeping '+millisecs+'ms....zzzzzz')
    }, millisecs);
}
motionCtrl.controller('AlertDemoCtrl', function ($scope) {

});
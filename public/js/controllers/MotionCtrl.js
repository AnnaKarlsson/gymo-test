// Locals
var motionCtrl = angular.module('MotionCtrl', ['mediaPlayer','ngSanitize', 'ngCsv']);

motionCtrl.controller('MotionController', function($scope, $timeout, $interval) {

  $scope.tagline = 'Never standing still';
  $scope.recBtnTxt = "Record motion";
  $scope.measurementsDOWN = [];
  $scope.measurementsUP = [];
  $scope.measurements = [];
  $scope.sampleProgress = 0;
  var notify = new Audio("views/sound/notification.wav");
  var measureIntervall = 1; //ms
  var nbrOfMeaurements = 1000; 
  var gammaTiltAngle = 10;
  var betaTiltAngle = 5;
  /*Total time of measurements will be measureIntervall * nbrOfMeasurements in ms*/
  var isRecording = false;
  var isUpsideUP = false;
  var isUpsideDOWN = false;
  var isFlat = false;
  

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
  if(window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(event) {
      if(event.gamma > -gammaTiltAngle && event.gamma < gammaTiltAngle){ 
        isFlat = true;
        if (event.beta < -betaTiltAngle && event.beta < betaTiltAngle) { 
          isUpsideUP = true;
          isUpsideDOWN = false;
        }else if(event.beta > -(180-betaTiltAngle) && event.beta < -(180+betaTiltAngle)){
          isUpsideDOWN = true;
          isUpsideUP = false;
        }else{isUpsideDOWN = false; isUpsideUP = false;}
      }else{
        isFlat = false; 
        $scope.alerts = [ 
          {msg : 'Put your device on a flat surface'}
        ];
      }
    }, false);
  }  
  /*NOTE X; -0.4:1.2, Y;-0.2:0.25, Z: 9.6-10 (Apple; -9.98:-9.82, Android; 9.6:10 */
  $scope.onCountdown = function(){
    if ($scope.counter > 0) {
      $scope.counter--;
      $scope.measurements.push({'vX': $scope.valueX, 'vY': $scope.valueY, 'vZ':$scope.valueZ});
      $scope.sampleProgress = Math.ceil(100*((1-($scope.counter / nbrOfMeaurements))));
      $scope.recBtnTxt = "Recording 1: "+$scope.sampleProgress+"%";
      mytimeout = $timeout($scope.onCountdown,measureIntervall);
    }else{
      if(isRecording){
        $scope.isDisabled = true;
        notify.play();
        isRecording = false;
        $scope.recBtnTxt = "Recording 2: 0%";
        $scope.addAlert('Turn your device upside-down until your hear a notification-sound');
        if(isFlat && isUpsideDOWN){
          recordDownMotion();
        }
      }
      
      $scope.$apply();
    }
  };
  var mytimeout = $timeout($scope.onCountdown,measureIntervall);
    
  $scope.recordMotion= function(){
    if(isFlat && isUpsideUP){
      $scope.alerts = [];
      isRecording = true;
      $scope.measurements = [];
      $scope.isDisabled = true;
      $scope.counter = nbrOfMeaurements;
      $scope.rMessage = "Recording ";
      mytimeout = $timeout($scope.onCountdown,measureIntervall);
    }else {}
    
  };

  // CSV download stuff
  $scope.getArray = $scope.measurements;
  $scope.getHeader = function () {return ["X", "Y", "Z"]};
  $scope.clickFn = function() {
    console.log("downloading motion data as CSV");
  };

  $scope.alerts = [
  ];

  $scope.addAlert = function(alertMsg) {
    $scope.alerts.push({msg: alertMsg});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
  
});

function recordDownMotion(){
  // TODO
}

motionCtrl.controller('AlertDemoCtrl', function ($scope) {

});
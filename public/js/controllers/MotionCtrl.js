// Locals
var motionCtrl = angular.module('MotionCtrl', ['mediaPlayer','ngSanitize', 'ngCsv']);

motionCtrl.controller('MotionController', function($scope, $timeout, $interval) {

  $scope.tagline = 'Never standing still';
  $scope.recBtnTxt = "Record motion";
  $scope.measurementsDOWN = [];
  $scope.measurementsUP = [];
  $scope.sampleProgress = 0;
  var notify = new Audio("views/sound/notification.wav");
  var measureIntervall = 1; //ms
  var nbrOfMeaurements = 1000; 
  /*Total time of measurements will be measureIntervall * nbrOfMeasurements in ms*/
  var isRecording = false;
  var isZneg = false;
  var isZpos = false;
  

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
  /*NOTE X; -0.4:1.2, Y;-0.2:0.25, Z: 9.6-10 (Apple; -9.98:-9.82, Android; 9.6:10 */
  $scope.onCountdown = function(){
    $scope.counter--;
    if ($scope.counter > 0) {
      $scope.measurementsUP.push({'vX': $scope.valueX, 'vY': $scope.valueY, 'vZ':$scope.valueZ});
      $scope.sampleProgress = Math.ceil(100*((1-($scope.counter / nbrOfMeaurements))));
      $scope.recBtnTxt = "Recording "+$scope.sampleProgress+"%";
      mytimeout = $timeout($scope.onCountdown,measureIntervall);
    }else{
      if(isRecording){
        
        $scope.isDisabled = true;
        notify.play();
        isRecording = false;
        $scope.recBtnTxt = "Click and turn your deice upside-down and wait for sound before turning back";
        if ($scope.measurementsUP.get(200).vZ < -5) { 
          isApple = true;
        }else { 
          isApple = false;
        }
      }
      
      $scope.$apply();
    }
  };
  var mytimeout = $timeout($scope.onCountdown,measureIntervall);
    
  $scope.recordMotion= function(){
    isRecording = true;
    $scope.measurementsUP = [];
    $scope.isDisabled = true;
    $scope.counter = nbrOfMeaurements;
    $scope.rMessage = "Recording ";
    mytimeout = $timeout($scope.onCountdown,measureIntervall);
  };

  // CSV download stuff
  $scope.getArray = $scope.measurementsUP;
  $scope.getHeader = function () {return ["X", "Y", "Z"]};
  $scope.clickFn = function() {
    console.log("downloading motion data as CSV");
  };
  
});

motionCtrl.controller('AlertDemoCtrl', function ($scope) {
  $scope.alerts = [
    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
  ];

  $scope.addAlert = function() {
    $scope.alerts.push({msg: 'Another alert!'});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
});
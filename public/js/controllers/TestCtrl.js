var nX, nY, nZ, nA, nB, nG;
var alert;
var isRecDone = true;

var measureIntervall = 1; //ms
var nbrOfMeaurements = 10; 
if(window.DeviceMotionEvent) {
  window.addEventListener('devicemotion', function(event) {
    if(event.acceleration) {
      nX = event.acceleration.x;
      nY = event.acceleration.y;
      nZ = event.acceleration.z;
    }
  });
}
if(window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', function(event) {
    if(event.alpha!=null || event.beta!=null || event.gamma!=null){ 
      nA = event.alpha;
      nB = event.beta;
      nG = event.gamma;
    }
  }, false);
}

angular.module('TestCtrl', ['ngSanitize', 'ngCsv'])
.controller('formController', function($scope, $timeout, $interval, $http) {
  console.log('isRecDone: '+$scope.isRecDone);
  $scope.tagline = 'Never standing still';
  $scope.recBtnTxt = "Record";
  
  $scope.sampleProgress = 0;
  $scope.isRecDone = false;
  /*Total time of measurements will be measureIntervall * nbrOfMeasurements in ms*/


  
  $scope.record= function(){
    if (nX == undefined || nA == undefined) {
      $scope.alerts = [ {msg : 'Device motion not supported', type:'info'}];
    }else{
      status = '';
      isStill();
      console.log('after runned isStill() status ='+status);
      if (status == 'still'){    
        isRecDone = false;
        $scope.isDisabled = true;
        $scope.measurementsGyro = [];
        $scope.measurementsMotion = [];
        $scope.counter = nbrOfMeaurements;
        $scope.rMessage = "Recording ";
        console.log('Start recording...')
        mytimeout = $timeout($scope.onCountdown,measureIntervall);
        console.log('...end recording');
      }else{
        $scope.alerts = [{msg : 'Put your device on a flat surface', type:'danger'}];
      }
    }
  };

  $scope.onCountdown = function(){
    if ($scope.counter > 0) {
      $scope.counter--;
      $scope.sampleProgress = Math.ceil(100*((1-($scope.counter / nbrOfMeaurements))));
      $scope.recBtnTxt = "Recording: "+$scope.sampleProgress+"%";
      $scope.measurementsMotion.push({'vX': nX, 'vY': nY, 'vZ': nZ});
      $scope.measurementsGyro.push({'alpha': nA, 'beta': nB, 'gamma': nG});
      mytimeout = $timeout($scope.onCountdown,measureIntervall);
    }else{
      console.log('in else... : '+$scope.recBtnTxt)
      if($scope.recBtnTxt == "Recording: 100%"){
        $scope.isRecDone = true;
        console.log('isRecDone: '+$scope.isRecDone);
        $scope.$apply();
      }
    }
    $scope.$apply();
}

  var mytimeout = $timeout($scope.onCountdown,measureIntervall);

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

  /* MAIL FORM DATA */
  $scope.sendMail = function(isValid){
    if(isRecDone && isValid){
      var mail = {
        emailFrom : $scope.emailFrom,
        model : $scope.model,
        text : 'mailing...'
      }
      var res = $http.post('/send', mail);
      res.success(function(data, status, headers, config) {
        $scope.message = data;
        $scope.alerts = [{msg:'THANK YOU! <br> Your recordnings has been send!', type:'success'}];
      });
      res.error(function(data, status, headers, config) {
        $scope.alerts = [{msg:'Did not manage to send mail..', type:'danger'}];
      });

    }else if(!isRecDone){
      $scope.alerts = [{msg:'Your recording is not done', type:'danger'}];

    }else{
      $scope.alerts = [{msg:'Fill in form below before sending', type:'warning'}];
      
    }

  }
});

function isStill(){
  var a1 = Math.floor(nA);
  var b1 = Math.floor(nB);
  var g1 = Math.floor(nG);
  console.log('abg1: '+a1+', '+b1+', '+g1);
  count = 0;
  while(count < 1000){
    count++; 
    if ((count % 100) == 0 ) { 
      console.log('count on :'+count);
    }
  }
  var a2 = Math.floor(nA);
  var b2 = Math.floor(nB);
  var g2 = Math.floor(nG);
  console.log('abg2: '+a2+', '+b2+', '+g2);
  if (a1 == Math.floor(nA) && b1 == Math.floor(nB) && g1 == Math.floor(nG)) {
    status = 'still';
    console.log('Device is still');
    return true;
  }else{
    status = 'moving';
    console.log('Device is NOT still');
    return false;
  }
}
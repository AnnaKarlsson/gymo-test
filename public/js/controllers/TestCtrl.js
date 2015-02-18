var nX, nY, nZ, nA, nB, nG;
var alert;
var measureIntervall = 1; //ms
var nbrOfMeaurements = 1000; 

/* Motion listener */
if(window.DeviceMotionEvent) {
  window.addEventListener('devicemotion', function(event) {
    if(event.acceleration) {
      nX = event.acceleration.x;
      nY = event.acceleration.y;
      nZ = event.acceleration.z;
    }
  });
}
/* Gyro listener*/
if(window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', function(event) {
    if(event.alpha!=null || event.beta!=null || event.gamma!=null){ 
      nA = event.alpha;
      nB = event.beta;
      nG = event.gamma;
    }
  }, false);
}

/* Controller for test-data */
angular.module('TestCtrl', ['ngSanitize', 'ngCsv'])
.controller('formController', function($scope, $timeout, $interval, $http) {
  $scope.deviceType = WURFL.form_factor;
  $scope.deviceName = WURFL.complete_device_name;
  $scope.tagline = 'Never standing still';
  $scope.recBtnTxt = "Record";
  $scope.noMobileDeive = false;
  $scope.sampleProgress = 0;
  $scope.isRecDone = false;
  
  var arrayAsString = '';
  var gyroString = '';
  var motionString = '';

  /* ===== RECORD ====== */
  $scope.record= function(){
    if (!WURFL.is_mobile) {
      $scope.alerts = [ {msg : 'This device is not support motion', type:'info', label:'Sorry,'}];
      $scope.isDisabled = true;
    }else{
      $scope.noMobileDeive = false;
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
        mytimeout = $timeout($scope.onCountdown,measureIntervall);
      }else{
        $scope.alerts = [{msg : 'Put your device on a flat surface', type:'danger', label:'Warning!'}];
      }
    }
  };

  $scope.onCountdown = function(){
    if ($scope.counter > 0) {
      $scope.counter--;
      $scope.sampleProgress = Math.ceil(100*((1-($scope.counter / nbrOfMeaurements))));
      $scope.recBtnTxt = "Recording: "+$scope.sampleProgress+"%";
      if($scope.counter > nbrOfMeaurements -11){
        $scope.measurementsMotion.push({'a': nX, 'b': nY, 'c': nZ});
        $scope.measurementsGyro.push({'a': nA, 'b': nB, 'c': nG});
      }
      gyroString += nA+','+nB+','+nG+'\n';
      motionString += nX+','+nY+','+nZ+'\n';
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

  /* ===== ALERTS =====*/
  $scope.alerts = [];
  $scope.addAlert = function(alertMsg) {
    $scope.alerts.push({msg: alertMsg});
  };
  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  /* ===== SUBMIT & MAIL FORM DATA =====*/
  $scope.formData = {};
  // function to submit the form after all validation has occurred      
  $scope.sendMail = function(isValid){
    $scope.onSending = true;
    if($scope.isRecDone && isValid){
      if ($scope.formData.cc) {
        emailTo = $scope.formData.email;
      }else{
        emailTo = 'gyrotion@gmail.com'
      }
      var mail = {
        emailFrom : $scope.formData.email,
        emailTo : emailTo,
        model : $scope.deviceType+': '+$scope.deviceName,
        gyro : 'alpha,beta,gamma\n'+gyroString,
        motion : 'x,y,z\n'+motionString
      }
      var res = $http.post('/send', mail);
      res.success(function(data, status, headers, config) {
        $scope.message = data;
        $scope.alerts = [{msg:'Your recordnings has been send!', type:'success', label:'THANK YOU!'}];
        $scope.onSending = true;
      });
      res.error(function(data, status, headers, config) {
        $scope.alerts = [{msg:'Did not manage to send mail..', type:'danger', label:'Warning!'}];
        $scope.onSending = false;
      });

    }else if(!$scope.isRecDone){
      $scope.alerts = [{msg:'Please make a motion and gyro recording before sending', type:'danger', label:'Missing!'}];
       $scope.onSending = false;
    }else if(!formData.email){
      $scope.alerts = [{msg:'Please fill in your email', type:'warning', label:'Not enough info!'}];
      $scope.onSending = false;
    }else{
      $scope.alerts = [{msg:'Please fill in form in the "Device"-tab', type:'warning', label:'Not enough info!'}];
      $scope.onSending = false;
    }

  };
});


// FIXA DENNA!!!!!
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


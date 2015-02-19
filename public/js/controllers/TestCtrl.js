var isStill = false;
var measureIntervall = 1; //ms
var nbrOfMeaurements = 1000; 

/* Controller for test-data */
angular.module('TestCtrl', ['ngSanitize'])
.controller('formController', function($scope, $timeout, $interval, $http) {
  /* Motion listener */
  if(window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function(event) {
      if(event.accelerationIncludingGravity) {
        $scope.accX = event.accelerationIncludingGravity.x;
        $scope.accY = event.accelerationIncludingGravity.y;
        $scope.accZ = event.accelerationIncludingGravity.z;
        $scope.accR = event.rotationRate;
      }else if(event.acceleration){
        $scope.accX = event.acceleration.x;
        $scope.accY = event.acceleration.y;
        $scope.accZ = event.acceleration.z;
        $scope.accR = event.rotationRate;
      }
      if (($scope.accR.alpha).toFixed(2) == 0 && ($scope.accR.beta).toFixed(2) == 0 && ($scope.accR.gamma).toFixed(2) == 0)
        isStill = true;
      else isStill = false;
    });
  }
  /* Gyro listener*/
  if(window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(event) {
      if(event.alpha!=null || event.beta!=null || event.gamma!=null){ 
        
        $scope.gyroBeta = event.beta;
        $scope.gyroGamma = event.gamma;
        //Check for iOS property
        if(event.webkitCompassHeading) {
          $scope.gyroAlpha = event.webkitCompassHeading;
            //Direction is reversed for iOS
            dir='-';
        }else{
          $scope.gyroAlpha = event.alpha;
        }
      }
    }, false);
  }
  $scope.deviceType = WURFL.form_factor;
  $scope.deviceName = WURFL.complete_device_name;
  $scope.recBtnTxt = "Record";
  $scope.noMobileDeive = false;
  $scope.sampleProgress = 0;
  $scope.isRecDone = false;
  
  var gyroString = '';
  var motionString = '';

  /* ===== RECORD ====== */
  $scope.record= function(){
    if (!WURFL.is_mobile) {
      $scope.alerts = [ {msg : 'This device is not support motion', type:'info', label:'Sorry,'}];
      $scope.isDisabled = true;
    }else{
      $scope.noMobileDeive = false;
      console.log('after runned isStill() status ='+status);
      if (isStill){    
        isRecDone = false;
        $scope.isDisabled = true;
        $scope.measurementsGyro = [];
        $scope.measurementsMotion = [];
        gyroString = '';
        motionString = '';
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
      if(!isStill){
        $scope.recBtnTxt = "Record";
        $scope.sampleProgress = 0;
        $scope.alerts = [{msg : 'Put your device on a flat surface', type:'danger', label:'Recording aborted!'}];
        $scope.isDisabled = false;
        return;
      }
      $scope.counter--;
      $scope.sampleProgress = Math.ceil(100*((1-($scope.counter / nbrOfMeaurements))));
      $scope.recBtnTxt = "Recording: "+$scope.sampleProgress+"%";
      if($scope.counter > nbrOfMeaurements -11){
        $scope.measurementsMotion.push({'a': $scope.accX, 'b': $scope.accY, 'c': $scope.accZ});
        $scope.measurementsGyro.push({'a': $scope.gyroAlpha, 'b': $scope.gyroBeta, 'c': $scope.gyroGamma});
      }
      gyroString += $scope.gyroAlpha+','+$scope.gyroBeta+','+$scope.gyroGamma+'\n';
      motionString += $scope.accX+','+$scope.accY+','+$scope.accZ+'\n';
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
/* Controller for test-data */
angular.module('TestCtrl', ['ngSanitize'])
.controller('formController', function($scope, $timeout, $interval, $http) {
  $scope.deviceType = WURFL.form_factor;
  $scope.deviceName = WURFL.complete_device_name;
  $scope.recBtnTxt = "Record";
  $scope.sampleProgress = 0;
  $scope.isRecDone = false;
  var gyroString = '';
  var motionString = '';
  var accR, accX, accY, accZ;
  var isStill = true;
  var measureIntervall = 1; //ms
  var nbrOfMeaurements = 1000; 

  /* Motion listener */
  if(window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function(event) {
      if(event.accelerationIncludingGravity) {
        accX = event.accelerationIncludingGravity.x;
        accY = event.accelerationIncludingGravity.y;
        accZ = event.accelerationIncludingGravity.z;
        accR = event.rotationRate;
      }else if(event.acceleration){
        accX = event.acceleration.x;
        accY = event.acceleration.y;
        accZ = event.acceleration.z; 
        accR = event.rotationRate;
      }
      $scope.motionUpdate(accX, accY, accZ, accR);
      if (($scope.accR.alpha).toFixed(2) == 0 && ($scope.accR.beta).toFixed(2) == 0 && ($scope.accR.gamma).toFixed(2) == 0){
        isStill = true;
      }
      else if(accZ < -8 && Math.abs(accX) < 0.1 && Math.abs(accY) < 0.3){
        isStill = true;
      }else isStill = false;
    });
  }
    /* Gyro listener*/
  if(window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(event) {
      if(event.alpha!=null || event.beta!=null || event.gamma!=null){        
        $scope.gyroBeta = event.beta;
        $scope.gyroGamma = event.gamma;
        $scope.gyroAlpha = event.alpha;
      }
    }, false);
  }

  $scope.motionUpdate = function(X, Y, Z, R){
    $scope.accX = X;
    $scope.accY = Y;
    $scope.accZ = Z;
    $scope.accR = R;
  }
  


  /* ===== RECORD ====== */
  $scope.record= function(){
    if (!WURFL.is_mobile) {
      $scope.alerts = [ {msg : 'This device is not support motion', type:'info', label:'Sorry,'}];
      $scope.isDisabled = true;
    }else{
      console.log('after runned isStill() status ='+status);
      if (isStill){    
        isRecDone = false;
        $scope.isDisabled = true;
        $scope.measurements = [];
        gyroString = 'alpha,beta,gamma\n';
        if(accR != undefined)
          motionString = 'x,y,z,alpha,beta,gamma\n';
        else
          motionString = 'x,y,z\n';
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
        if($scope.gyroAlpha != undefined)
          $scope.measurements.push({
            'x': $scope.accX, 
            'y': $scope.accY, 
            'z': $scope.accZ,
            'a': $scope.gyroAlpha,
            'b': $scope.gyroBeta,
            'g': $scope.gyroGamma
          });
        else{
          $scope.measurements.push({
            'x': $scope.accX, 
            'y': $scope.accY, 
            'z': $scope.accZ
          });
        }
      }
      gyroString += $scope.gyroAlpha+','+$scope.gyroBeta+','+$scope.gyroGamma+'\n';
      if(accR != undefined)
        motionString += $scope.accX+','+$scope.accY+','+$scope.accZ+','+$scope.accR.alpha+','+$scope.accR.beta+','+$scope.accR.gamma+'\n';
      else
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
  $scope.addAlert = function(alertMsg, type, label) {
    $scope.alerts.push({msg: alertMsg, type:type, label:label});
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
        //rotation : 'alpha,beta,gamma\n'+ rotationString ,
        motion : motionString,
        gyro : gyroString
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
    }/*else{
      $scope.alerts = [{msg:'Please fill in form in the "Device"-tab', type:'warning', label:'Not enough info!'}];
      $scope.onSending = false;
    }*/

  };
});
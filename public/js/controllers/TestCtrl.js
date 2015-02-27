var alerts, onSending;
/* Controller for test-data */
var app = angular.module('TestCtrl', ['ngSanitize']);
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, mail){
        var fd = new FormData();
        fd.append('file', file);
        fd.append('emailTo', 'gyrotion@gmail.com');
        fd.append('emailFrom',  mail.emailFrom);
        fd.append('model', mail.model);
        fd.append('gyro', mail.gyro);
        fd.append('motion', mail.motion);
        fd.append('browser', mail.browser);
        console.log('FD just before sending: ' + fd);
        console.log('File: '+file);
        $http.post('/send', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
          alerts = [{msg:'Your recordings has been sent.', type:'success', label:'THANK YOU!'}];
          onSending = true;
        })
        .error(function(){
          alerts = [{msg:'Did not manage to send mail..', type:'danger', label:'Warning!'}];
          onSending = false;
        });
    }
}]);
app.controller('formController', function($scope, $timeout, $interval, $http, fileUpload) {
  $scope.deviceType = WURFL.form_factor;
  $scope.deviceName = WURFL.complete_device_name;
  $scope.recBtnTxt = "Record";
  $scope.sampleProgress = 0;
  $scope.isRecDone = false;
  $scope.param = {};
  var gyroString = '';
  var motionString = '';
  var accR, accX, accY, accZ;
  var isStill = true;
  var measureIntervall = 1; //ms
  var nbrOfMeaurements = 1000; 


  /* Motion listener */
  if(window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function(event) {
      if(event.acceleration){
        accX = event.acceleration.x;
        accY = event.acceleration.y;
        accZ = event.acceleration.z; 
        accR = event.rotationRate;
      }else if(event.accelerationIncludingGravity) {
        accX = event.accelerationIncludingGravity.x;
        accY = event.accelerationIncludingGravity.y;
        accZ = event.accelerationIncludingGravity.z;
        accR = event.rotationRate;
      }
      $scope.motionUpdate(accX, accY, accZ, accR);
      if (($scope.accR.alpha).toFixed(1) == 0 && ($scope.accR.beta).toFixed(1) == 0 && ($scope.accR.gamma).toFixed(1) == 0){
        isStill = true;
      }
      else if(accZ < -8 && Math.abs(accX) < 1 && Math.abs(accY) < 1){
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

  var movie = '';

  /* ===== SUBMIT & MAIL FORM DATA =====*/
  $scope.formData = {};
  // function to submit the form after all validation has occurred      
  $scope.sendMail = function(){
    $scope.onSending = true;
    //if($scope.isRecDone && isValid){
    if(true){
      var mail = {
        emailFrom : '',//$scope.formData.email,
        emailTo : 'gyrotion@gmail.com',
        model : '',//$scope.deviceType+': '+$scope.deviceName,
        motion : motionString,
        gyro : gyroString,
        browser : navigator.vendor + '<br>userAgent: ' + navigator.userAgent + '<br>Platform: ' + navigator.platform
      }
      var file = $scope.myFile;
      console.log('file is ' + JSON.stringify(file));
      fileUpload.uploadFileToUrl(file, mail);
      $scope.alerts = alerts;
      $scope.onSending = onSending;

    }else if(!$scope.isRecDone){
      $scope.alerts = [{msg:'Please make a motion and gyro recording before sending', type:'danger', label:'Missing!'}];
      $scope.onSending = false;
    }else if(!formData.email){
      $scope.alerts = [{msg:'Please fill in your email', type:'warning', label:'Not enough info!'}];
      $scope.onSending = false;
    }
  };

});
/* Controller for test-data */
var app = angular.module('Ctrl', ['ngSanitize', 'angular-loading-bar']);
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

app.controller('Controller', function($scope, $timeout, $interval, $http) {
  $scope.deviceType = WURFL.form_factor;
  $scope.deviceName = WURFL.complete_device_name;
  $scope.recBtnTxt = "Record";
  $scope.sampleProgress = 0;
  $scope.isRecDone = false;
  $scope.isDisabled = false;
  $scope.param = {};
  var gyroString = '';
  var motionString = '';
  var isStill = true;
  var fd = new FormData();
  var hasFile = false;
  var onSending = false;
  var time = 30;

  /* Motion listener */
  if(window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function(event) {
      if(event.acceleration){
        $scope.accX = event.acceleration.x;
        $scope.accY = event.acceleration.y;
        $scope.accZ = event.acceleration.z; 
        $scope.accR = event.rotationRate;
      }else if(event.accelerationIncludingGravity) {
        $scope.accX = event.accelerationIncludingGravity.x;
        $scope.accY = event.accelerationIncludingGravity.y;
        $scope.accZ = event.accelerationIncludingGravity.z;
        $scope.accR = event.rotationRate;
      }
      if (!event.acceleration) {
        if(Math.abs($scope.accZ) > 8 && Math.abs($scope.accX) < 1 && Math.abs($scope.accY) < 1)
          isStill = true;
        else isStill = false;
      }else if (0 == ($scope.accR.beta).toFixed(0) && ($scope.accR.alpha).toFixed(0) == 0 && ($scope.accR.gamma).toFixed(0) == 0){
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
  

  /* ===== RECORD ====== */
  $scope.clickedRecord= function(){
    if (!WURFL.is_mobile) {
      $scope.alerts = [ {msg : 'This device is not support motion', type:'info', label:'Sorry,'}];
      $scope.isDisabled = true;
    }else{
      $scope.isDisabled = true;
      // Compensate for devices with non flat backs
      $scope.recBtnTxt = "Recording.";
      window.setTimeout(function(){
        $scope.recBtnTxt = "Recording..";
        $scope.$apply();
        window.setTimeout(function(){
          $scope.recBtnTxt = "Recording...";
          $scope.$apply();
          window.setTimeout($scope.startRec(),333);
        },333);
      },333);
    }
  };
  var start;
  $scope.startRec = function(){
    if (isStill){
        isRecDone = false;
        $scope.isDisabled = true;
        gyroString = '';
        motionString = '';
        start = Math.floor(Date.now()/1000) + time;
        $scope.recTimeLeft = start - Math.floor(Date.now()/1000);
        $scope.recordning();
    }else{
      $scope.alerts = [{msg : 'Put your device on a flat surface', type:'danger', label:'Warning!'}];
      $scope.isDisabled = false;
      $scope.$apply();
    }
  }

  $scope.recordning = function(){
    if(Math.abs($scope.recTimeLeft) > 0) {
      if(!isStill){
        $scope.recBtnTxt = "Record";
        $scope.alerts = [{msg : 'Put your device on a flat surface', type:'danger', label:'Recording aborted!'}];
        $scope.isDisabled = false;
        $scope.$apply();
        return;
      }
      $scope.recBtnTxt = "Recording: "+$scope.recTimeLeft+"s left";
      $scope.$apply();
      gyroString += Date.now()+','+$scope.gyroAlpha+','+$scope.gyroBeta+','+$scope.gyroGamma+'\n';
      /*if ($scope.accR != undefined) {
        motionString += Date.now()+','+$scope.accX+','+$scope.accY +','+$scope.accZ+','+$scope.accR.alpha+','+$scope.accR.beta +','+$scope.accR.gamma+'\n';
      }else{*/
        motionString += Date.now()+','+$scope.accX+','+$scope.accY +','+$scope.accZ+'\n';
      //}
      $scope.recTimeLeft = start - Math.floor(Date.now()/1000);
      mytimeout = $timeout($scope.recordning,1);
    }
    else if($scope.recBtnTxt == "Recording: 1s left"){
      $scope.isRecDone = true;
      $scope.$apply();
    }
  }
  var mytimeout = $timeout($scope.recordning,1);

  /* ===== ALERTS =====*/
  $scope.alerts = [];
  $scope.addAlert = function(alertMsg, type, label) {
    $scope.alerts.push({msg: alertMsg, type:type, label:label});
  };
  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  /* ===== Upload from CAMERA ===== */
  /*C
  $scope.uploadFile = function(files) {
    //Take the first selected file
    if (files[0] != undefined) {
      if (files[0].type == 'video/mp4') {
        fd.append('filetype', 'mp4');
        fd.append('file', files[0]);
        $scope.hasFile = true;
      } else if(files[0].type == 'video/MOV'){
        fd.append('filetype', 'MOV');
        fd.append('file', files[0]);
        $scope.hasFile = true;
      }else{
        $scope.alerts = [{msg:'Record and upload a 5 seconds BLACK movie-clip', type:'danger', label:'Wrong!'}];
      }
      $scope.$apply();
    }
    
  };*/

  /* ===== SUBMIT & MAIL FORM DATA =====*/
  $scope.user = {};
  $scope.sendMail = function(isValid){
    $scope.onSending = true;
    if(/*C$scope.hasFile && */$scope.isRecDone && isValid){
      fd.append('mailfrom',  $scope.user.email);
      fd.append('model', $scope.deviceType+': '+$scope.deviceName);
      fd.append('gyro', gyroString);
      fd.append('motion', motionString);
      fd.append('browser', navigator.vendor + '<br>' + navigator.userAgent + '<br>' + navigator.platform);
      $http.post('/send', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
          $scope.alerts = [{msg:'Your recordings has been sent.', type:'success', label:'THANK YOU!'}];
          onSending = true;
        })
        .error(function(){
          $scope.alerts = [{msg:'Did not manage to send mail..', type:'danger', label:'Warning!'}];
          onSending = false;
        });
    }else if(!$scope.isRecDone){
      $scope.alerts = [{msg:'Please make a motion and gyro recording before sending', type:'danger', label:'Missing!'}];
      $scope.onSending = false;
    /*C}else if(!$scope.hasFile){
      $scope.onSending = false;
      $scope.alerts = [{msg:'Please add a clip from your camera', type:'warning', label:'Record camera!'}];*/
    }else if(!$scope.user.email){
      $scope.alerts = [{msg:'Please fill in your email', type:'warning', label:'Not enough info!'}];
      $scope.onSending = false;
    }
  }

});
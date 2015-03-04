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
  $scope.param = {};
  var gyroString = '';
  var motionString = '';
  var isStill = true;
  var measureIntervall = 1; //ms
  var nbrOfMeaurements = 1000; 
  var fd = new FormData();
  var hasFile = false;
  var onSending = false;


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
      if (($scope.accR.alpha).toFixed(0) == 0 && ($scope.accR.beta).toFixed(0) == 0 && ($scope.accR.gamma).toFixed(0) == 0){
        isStill = true;
      }else if($scope.accZ < -8 && Math.abs($scope.accX) < 1 && Math.abs($scope.accY ) < 1){
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
  $scope.record= function(){
    if (!WURFL.is_mobile) {
      $scope.alerts = [ {msg : 'This device is not support motion', type:'info', label:'Sorry,'}];
      $scope.isDisabled = true;
    }else{
      if (isStill){    
        isRecDone = false;
        $scope.isDisabled = true;
        $scope.measurements = [];
        gyroString = 'alpha,beta,gamma\n';
        if($scope.accR != undefined)
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
            'y': $scope.accY , 
            'z': $scope.accZ,
            'a': $scope.gyroAlpha,
            'b': $scope.gyroBeta,
            'g': $scope.gyroGamma
          });
        else{
          $scope.measurements.push({
            'x': $scope.accX, 
            'y': $scope.accY , 
            'z': $scope.accZ
          });
        }
      }
      gyroString += $scope.gyroAlpha+','+$scope.gyroBeta+','+$scope.gyroGamma+'\n';
      if($scope.accR != undefined)
        motionString += $scope.accX+','+$scope.accY +','+$scope.accZ+','+$scope.accR.alpha+','+$scope.accR.beta+','+$scope.accR.gamma+'\n';
      else
        motionString += $scope.accX+','+$scope.accY +','+$scope.accZ+'\n';
      mytimeout = $timeout($scope.onCountdown,measureIntervall);
    }else{
      if($scope.recBtnTxt == "Recording: 100%"){
        $scope.isRecDone = true;
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
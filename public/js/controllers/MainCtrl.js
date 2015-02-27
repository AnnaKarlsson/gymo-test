// ALL GLOBAL VARIABLES
var gyroString = '';
var motionString = '';
var accR, accX, accY, accZ;
var isStill = true;
var measureIntervall = 1; //ms
var nbrOfMeaurements = 1000; 
var gyroString, motionString, isRecDone;

var upload = angular.module('MainCtrl', [])
upload.directive('fileModel', ['$parse', function ($parse) {
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

upload.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        })
        .error(function(){
        });
    }
}]);

upload.controller('MainController', ['$scope', 'fileUpload', function($scope, fileUpload){
  $scope.formData = {};
  $scope.uploadForm = function(isValid){
    $scope.onSending = true;
    //if($scope.isRecDone && isValid){
    if(true){
      var mail = {
        emailFrom : $scope.formData.email,
        emailTo : 'gyrotion@gmail.com',
        model : $scope.deviceType+': '+$scope.deviceName,
        motion : motionString,
        gyro : gyroString,
        browser : navigator.vendor + '<br>userAgent: ' + navigator.userAgent + '<br>Platform: ' + navigator.platform
      }
      var file = $scope.myFile;

      console.log('file is ' + JSON.stringify(file));
      fileUpload.uploadFileToUrl(file, mail);
    }
    else if(!$scope.isRecDone){
      $scope.alerts = [{msg:'Please make a motion and gyro recording before sending', type:'danger', label:'Missing!'}];
       $scope.onSending = false;
    }
    else if(!formData.email){
      $scope.alerts = [{msg:'Please fill in your email', type:'warning', label:'Not enough info!'}];
      $scope.onSending = false;
    }
  };
    
}]);
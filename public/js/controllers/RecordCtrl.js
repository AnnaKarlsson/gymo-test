/* Controller for test-data */
angular.module('RecordCtrl', ['ngSanitize'])
.controller('RecordController', function($scope, $timeout, $interval) {
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
});
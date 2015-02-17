var sendDataCtrl = angular.module('SendDataCtrl', ['ngCsv']);

sendDataCtrl.controller('SendDataController', function($scope, $http){
  $scope.tagline = 'Node.JS Email application';

  $scope.sendMail = function(){
    var mail = {
      emailFrom : $scope.emailFrom,
      model : $scope.model,
      text : 'mailing...'
    }
    var res = $http.post('/send', mail);
    res.success(function(data, status, headers, config) {
      $scope.message = data;
    });
    res.error(function(data, status, headers, config) {
      alert( "failure message: " + JSON.stringify({data: data}));
    });
  }
	// CSV download stuff
  $scope.getArray = $scope.measurements;
  $scope.getHeader = function () {return ["X", "Y", "Z"]};
  $scope.clickFn = function() {
    console.log("downloading motion data as CSV");
  };
});

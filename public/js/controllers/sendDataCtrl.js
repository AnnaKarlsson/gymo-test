var sendDataCtrl = angular.module('SendDataCtrl', ['ngCsv']);

sendDataCtrl.controller('SendDataController', function($scope){
  $scope.tagline = 'Node.JS Email application';
  $scope.form.emailTo = 'your@email.nu';
  $scope.form.model = 'iPhone 3, Sony Xperia Z1 Compact, Samsung S3...';

  $scope.sendMail = function(){

  }
	// CSV download stuff
  $scope.getArray = $scope.measurements;
  $scope.getHeader = function () {return ["X", "Y", "Z"]};
  $scope.clickFn = function() {
    console.log("downloading motion data as CSV");
  };
});


$(document).ready(function(){
    var from,to,subject,text;
    $("#send_email").click(function(){      
        to=scope.form.emailTo;
        subject='Gyrotion on '+$scope.form.model;
        text='data from csv later...';
        $("#message").text("Sending E-mail...Please wait");
        $.get("http://localhost:8080/send",{to:to,subject:subject,text:text},function(data){
        if(data=="sent")
        {
            $("#message").empty().html("Email is been sent at "+to+" . Please check inbox !");
        }

});
    });
});
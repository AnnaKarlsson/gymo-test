angular.module('MotionService', []).factory('Motion', ['$http', function($http) {
	return {
     	postEmail: function(emailData,callback){
       		$http.post("/postEmail/", emailData).success(callback);  
     	}
   	}
	

}]);
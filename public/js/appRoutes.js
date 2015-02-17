angular.module('appRoutes', ['ngAnimate', 'ui.router'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/motion', {
			templateUrl: 'views/motion.html',
			controller: 'MotionController'
		})

		.when('/gyro', {
			templateUrl: 'views/gyro.html',
			controller: 'GyroController'	
		})

		.when('/send-data', {
			templateUrl: 'views/send-data.html',
			controller: 'SendDataController'	
		});

	$locationProvider.html5Mode(true);

}]);
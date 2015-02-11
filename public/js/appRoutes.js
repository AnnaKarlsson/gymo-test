angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

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
		});

	$locationProvider.html5Mode(true);

}]);
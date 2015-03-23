
// create our angular app and inject ngAnimate and ui-router 
// =============================================================================
angular.module('gymoApp', ['ngAnimate', 'ui.router','Ctrl'])
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
}])

// configuring our routes 
// =============================================================================
.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'views/home.html',
            controller: 'Controller'
        })

        .state('home.data', {
            url: '/data',
            templateUrl: 'views/live-motion.html'
        })
        
        .state('home.motion', {
            url: '/motion',
            templateUrl: 'views/motion.html'
        })

        .state('home.about', {
            url: '/about',
            templateUrl: 'views/about.html'
        })
        
        .state('home.camera', {
            url: '/camera',
            templateUrl: 'views/camera.html'
        })

        .state('home.submit', {
            url: '/submit',
            templateUrl: 'views/submit.html'
        });
       
    // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('home/motion');
})

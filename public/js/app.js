
// create our angular app and inject ngAnimate and ui-router 
// =============================================================================
angular.module('gymoApp', ['ngAnimate', 'ui.router','TestCtrl', 'GyroCtrl'])

// configuring our routes 
// =============================================================================
.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
    
        // route to show our basic form (/form)
        .state('form', {
            url: '/form',
            templateUrl: 'views/home.html',
            controller: 'formController'
        })

        .state('form.gyro', {
            url: '/gyro',
            templateUrl: 'views/live-gyro.html',
            controller: 'GyroController'
        })

        .state('form.motion', {
            url: '/motion',
            templateUrl: 'views/live-motion.html'
        })
        
        .state('form.record', {
            url: '/record',
            templateUrl: 'views/record.html'
        })

        .state('form.camera', {
            url: '/camera',
            templateUrl: 'views/camera.html'
        })

        .state('form.about', {
            url: '/about',
            templateUrl: 'views/about.html'
        })
        
        // url will be /form/payment
        .state('form.send', {
            url: '/send',
            templateUrl: 'views/send-data.html'
        });
       
    // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/form/record');
})

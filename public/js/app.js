
// create our angular app and inject ngAnimate and ui-router 
// =============================================================================
angular.module('gymoApp', ['ngAnimate', 'ui.router','TestCtrl', 'CompassCtrl'])

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

        .state('form.compass', {
            url: '/compass',
            templateUrl: 'views/compass.html',
            controller: 'CompassController'
        })
        
        // nested states 
        // each of these sections will have their own view
        .state('form.motion', {
            url: '/motion',
            templateUrl: 'views/motion.html'
        })

        .state('form.info', {
            url: '/info',
            templateUrl: 'views/info.html'
        })
        
        .state('form.gyro', {
            url: '/gyro',
            templateUrl: 'views/gyro.html'
        })

        .state('form.device', {
            url: '/device',
            templateUrl: 'views/device-info.html'
        })
        
        // url will be /form/payment
        .state('form.send', {
            url: '/send',
            templateUrl: 'views/send-data.html'
        });
       
    // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/form/motion');
})

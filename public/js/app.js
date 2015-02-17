
// create our angular app and inject ngAnimate and ui-router 
// =============================================================================
angular.module('gymoApp', ['ngAnimate', 'ui.router','TestCtrl'])

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
        
        // nested states 
        // each of these sections will have their own view
        // url will be nested (/form/profile)
        .state('form.motion', {
            url: '/motion',
            templateUrl: 'views/motion.html'
        })
        
        // url will be /form/interests
        .state('form.gyro', {
            url: '/gyro',
            templateUrl: 'views/gyro.html'
        })
        
        // url will be /form/payment
        .state('form.send', {
            url: '/send',
            templateUrl: 'views/send-data.html'
        });
       
    // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/form');
})

// our controller for the form
// =============================================================================

angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    }).state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        }
      }
    })
    .state('app.perfil', {
        url: '/perfil',
        views: {
          'menuContent': {
            templateUrl: 'templates/perfil.html',
            controller: 'PerfilCtrl'
          }
        }
      })
    .state('app.creardesafios', {
      url: '/creardesafios',
      views: {
        'menuContent': {
          templateUrl: 'templates/crearDesafio.html',
          controller: 'CrearDesafioCtrl'
        }
      }
    })
    .state('app.buscardesafios', {
      url: '/buscardesafios',
      views: {
        'menuContent': {
          templateUrl: 'templates/buscarDesafios.html',
          controller: 'BuscarDesafiosCtrl'
        }
      }
    })
    .state('app.obtenercreditos', {
      url: '/obtenercreditos',
      views: {
        'menuContent': {
          templateUrl: 'templates/obtenerCreditos.html',
          controller: 'ObtenerCreditosCtrl'
        }
      }
    })
    .state('app.misdesafios', {
      url: '/misdesafios',
      views: {
        'menuContent': {
          templateUrl: 'templates/misDesafios.html',
          controller: 'MisDesafiosCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});

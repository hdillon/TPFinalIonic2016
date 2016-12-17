angular.module('starter',
 [
 'ionic','ionic-material',
 'ionMdInput',
 'firebase',
 'starter.controllers',
 'starter.controladorCreditos',
 'starter.controllerlogin',
 'starter.controllerregistro',
 'starter.controllerdesafios',
 'starter.services',
 'starter.miserviciofirebase',
 'starter.factoryUsuario',
 'ngCordova',
 'ngMessages',
 'mdo-angular-cryptography',
 'ng-mfb'])

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

.config(function($stateProvider, $urlRouterProvider, $cryptoProvider) {
  $cryptoProvider.setCryptographyKey('ABCD123');//Esta es la clave de encripción
  
  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
    .state('login', {
    url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'

    })
    .state('registro', {
      url: '/registro',
        templateUrl: 'templates/registro.html',
        controller: 'RegistroCtrl'
    })
    .state('app.perfil', {
        url: '/perfil',
        cache: false,
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
      cache: false,
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
    .state('app.altacreditos', {
      url: '/altacreditos',
      views: {
        'menuContent': {
          templateUrl: 'templates/altaCreditos.html',
          controller: 'AltaCreditosCtrl'
        }
      }
    })
    .state('app.jugar', {
      url: '/jugar/:partida',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: 'templates/jugar.html',
          controller: 'JugarCtrl'
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

  $urlRouterProvider.otherwise('/login');
});

angular.module('starter.controllerperfil', [])

.controller('PerfilCtrl', function($scope, Usuario, $ionicLoading, $timeout) {
  Usuario.cargarUsuario(Usuario.getUsuario().id);
  $ionicLoading.show({content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 2 });
  
  $timeout(function() {
  $ionicLoading.hide();
  $scope.email = Usuario.getUsuario().email;
  $scope.nombre = Usuario.getUsuario().nombre;
  $scope.credito = Usuario.getUsuario().credito;
  $scope.victorias = Usuario.getUsuario().victorias;
  $scope.derrotas = Usuario.getUsuario().derrotas;
  }, 3000);

});


angular.module('starter.controllerdesafios', [])

.controller('BuscarDesafiosCtrl', function($scope) {

})

.controller('MisDesafiosCtrl', function($scope) {

})


.controller('CrearDesafioCtrl', function($scope, $state, $timeout, Usuario, $ionicLoading, MiServicioFB) {
	$scope.desafio = {};
  $scope.crearApuesta = function() {
  	//cuando preciona el boton bloqueo la interfaz con el spinner hasta que termine el proceso
	$ionicLoading.show({
		content: 'Loading',
		animation: 'fade-in',
		showBackdrop: true,
		maxWidth: 200,
		showDelay: 2
	});

    console.info("user",Usuario.getUsuario());
    $scope.desafio.usuario = Usuario.getUsuario();
    $scope.desafio.activo = true;

    MiServicioFB.Guardar("/Desafios/", $scope.desafio)
    .then(function(resultado){
    	$ionicLoading.hide();
    	$state.go('app.buscardesafios');
    },function (error){
        console.log("Error!!");
        $ionicLoading.hide();
  	});  

  	//Por las dudas siempre intento ocultar el spinner pasados 10 seg.
	$timeout(function () {
		$ionicLoading.hide();
	}, 10000);
  }

});
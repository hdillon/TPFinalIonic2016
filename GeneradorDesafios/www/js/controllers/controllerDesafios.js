angular.module('starter.controllerdesafios', [])

.controller('BuscarDesafiosCtrl', function($scope, $state, $timeout, Usuario, $ionicLoading, MiServicioFB, ionicMaterialInk, ionicMaterialMotion) {
  //cuando preciona el boton bloqueo la interfaz con el spinner hasta que termine el proceso
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 2
  });

  console.info(Usuario.getUsuario());

	$scope.ListadoDesafios = [];
	var i = 0;
	MiServicioFB.Cargar('/Desafios')
	.on('child_added',function(snapshot)
	{
		$scope.ListadoDesafios.push(snapshot.val());
	});

  //Activa los efectos MaterialMotion
  $timeout(function () {
		$ionicLoading.hide();
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });
	}, 5000);

	$scope.aceptarDesafio = function(desafio) {
  		//alert("Esperar que " + desafio.usuario.nombre + " responda...");
      var partida = {};
      partida.creador = desafio.usuario;
      partida.retador = Usuario.getUsuario();
      partida.apuesta = desafio.apuesta;
      console.info("desa ", desafio);
      MiServicioFB.Guardar("/Partidas/", partida)
    .then(function(resultado){
      $state.go('app.jugar');
    },function (error){
        console.log("Error!!");
  
    });  
      
	}

  $scope.crearDesafio = function() {
      $state.go('app.creardesafios');
  }

  $scope.actualizar = function() {
       $state.reload();
  }

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
angular.module('starter.controladorCreditos', [])

.controller('AltaCreditosCtrl', function($scope, servicioABM) {
  $scope.credito = {};
  $scope.credito.cantidad = '0';

  $scope.altaCredito = function(){
    servicioABM.altaCredito($scope.credito.cantidad);
  }


})

.controller('ObtenerCreditosCtrl', function($scope, $ionicPlatform, $cordovaBarcodeScanner,$firebaseArray, servicioABM, Usuario) {
	var FBRef = new Firebase("https://generadordesafios.firebaseio.com/Creditos");
	$scope.datosFB;
	$scope.datosFBArray = $firebaseArray(FBRef);
	$scope.cantidadCredito;
  	

  $scope.scanear = function(){
    try{
      $ionicPlatform.ready(function() {
      
        $cordovaBarcodeScanner
        .scan()
        .then(function(barcodeData) {
          console.info("CodigoQR: ", barcodeData);
          $scope.validarCodigo(barcodeData);
        }, function(error) {
          console.info("Error: ", error);
        });

      });
    }catch(err){
      console.log("No es un dispositivo mobile!");
    }
  }

//valida que el código exista y no está usado
  $scope.validarCodigo = function(codigo){
  	console.info("Codigo:", codigo);
  	 angular.forEach($scope.datosFBArray, function(creditos) {
        console.info("creditossss", creditos.codigo);
        if(creditos.codigo == codigo.text){
        	console.log("coinciden!!");
        	console.log("CODIGO: ", codigo.text);
        	Usuario.cargarCredito(codigo.text);
        }
     })
  }

})
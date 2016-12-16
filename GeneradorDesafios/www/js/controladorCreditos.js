angular.module('starter.controladorCreditos', [])

.controller('AltaCreditosCtrl', function($scope, servicioABM, MiServicioFB, Usuario, $crypto) {
  $scope.credito = {};
  $scope.credito.cantidad = '0';

  $scope.altaCredito = function(){
    //servicioABM.altaCredito($scope.credito.cantidad);
    var codigoEncriptado = {};
    var encrypted = $crypto.encrypt(Usuario.nombre + ' ' + fechaActual() + '$' + $scope.credito.cantidad);
    var decrypted = $crypto.decrypt(encrypted);
    codigoEncriptado.codigo = encrypted;
    codigoEncriptado.usado = false;
    MiServicioFB.Guardar("/Creditos/" + encrypted + "/", codigoEncriptado);
  }

  function fechaActual(){
      now = new Date();
      year = "" + now.getFullYear();
      month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
      day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
      hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
      minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
      second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
      return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
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
      console.info("Falló cordovaBarcodeScanner: ",err);
    }
  }

//valida que el código exista y no está usado
  $scope.validarCodigo = function(codigo){
  	console.info("Codigo:", codigo);
  	 angular.forEach($scope.datosFBArray, function(creditos) {
        console.info("creditossss", creditos.codigo);
        if(creditos.codigo == codigo.text && !creditos.usado){
        	console.log("coinciden!!");
        	console.log("CODIGO: ", codigo.text);
        	Usuario.cargarCredito(codigo.text);
        }
     })
  }

})
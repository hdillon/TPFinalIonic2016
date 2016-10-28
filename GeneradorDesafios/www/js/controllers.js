angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopup) {
  $scope.loginData = {};
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('LoginCtrl', function($scope, $timeout, servicioABM) {
    $scope.loginData={};
    $scope.loginData.email = "dillonhoraciodavid@gmail.com";
    $scope.loginData.password = "34551422";
    $scope.mostrarLogin = true;
    $scope.mostrarLogOut = false;
    $scope.mostrarVerificar = false;

    $scope.loguear = function() {
      firebase.auth().signInWithEmailAndPassword($scope.loginData.email, $scope.loginData.password).catch(function(error) {
      console.info("error", error);
      alert("Datos incorrectos!");
      }).then(function(respuesta){
        console.info("RTA:", respuesta);
        alert("Bienvenido!");
        $timeout(function(){
          /*console.info("Esta Autenticado", respuesta.emailVerified);
          console.info("respuesta", respuesta);*/
          if(respuesta != undefined){
            $scope.mostrarLogin = false;
            if(respuesta.emailVerified)
            {
              $scope.mostrarLogOut = true;
            }else{
              $scope.mostrarVerificar = true;
            }
          }
        });
        
      });
    };

    $scope.registrarse = function() {
      firebase.auth().createUserWithEmailAndPassword($scope.loginData.email, $scope.loginData.password).catch(function(error) {

      var errorCode = error.code;
      var errorMessage = error.message;

      }).then(function(respuesta){
        console.info("REGISTRO: ", respuesta);
        $timeout(function(){
          $scope.loginData.uid = respuesta.uid;//MANEJAR ERRORES!
          servicioABM.altaUsuario($scope.loginData);
        });
        
      });
    }

//emailVerified: false

    $scope.desloguear = function() {
      firebase.auth().signOut().then(function(){
        $timeout(function(){
          console.info("outLogin", firebase.auth().currentUser);
          $scope.selogueo = false;
        });
        
      });
    };

    $scope.resetearPass = function() {
     firebase.auth().sendPasswordResetEmail($scope.loginData.email)
     .then(function(respuesta){
        console.info("respuestaReset", respuesta);
     }).catch(function(error){
      console.info("Se ropio el reset", error);

     });
     
    };
    
    $scope.verificarEmail = function() {
      alert("asd");
     
    };  

    $scope.showAlert = function(mensaje) {
      var alertPopup = $ionicPopup.alert({
         title: mensaje,
         okText: "ACEPTAR"
      });
      alertPopup.then(function(res) {
         // Custom functionality....

      });
   };

})

.controller('PerfilCtrl', function($scope) {

})

.controller('BuscarDesafiosCtrl', function($scope) {

})

.controller('MisDesafiosCtrl', function($scope) {

})

.controller('AltaCreditosCtrl', function($scope, servicioABM) {
  $scope.credito = {};
  $scope.credito.cantidad = '0';

  $scope.altaCredito = function(){
    servicioCreditos.altaCredito($scope.credito.cantidad);
  }


})

.controller('ObtenerCreditosCtrl', function($scope, $ionicPlatform, $cordovaBarcodeScanner) {

  $scope.scanear = function(){
    try{
      $ionicPlatform.ready(function() {
      
        $cordovaBarcodeScanner
        .scan()
        .then(function(barcodeData) {
          console.info("BarCode: ", barcodeData);
        }, function(error) {
          console.info("BarCode: ", barcodeData);
        });

      });
    }catch(err){
      console.log("No es un dispositivo mobile!");
    }
  }

})

.controller('CrearDesafioCtrl', function($scope, $stateParams) {
});

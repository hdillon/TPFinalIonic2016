angular.module('starter.controllerlogin', [])


.controller('LoginCtrl', function($scope, $timeout, servicioABM, Usuario) {
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
        //Cuando se loguea correctamente le seteo el uid al usuario
        Usuario.cargarUsuario(respuesta.uid);
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

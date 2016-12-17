angular.module('starter.controllerlogin', [])


.controller('LoginCtrl', function($scope, $timeout, $state, servicioABM, Usuario, $ionicLoading) {
    $scope.loginData={};
    $scope.loginData.email = "dillonhoraciodavid@gmail.com";
    $scope.loginData.password = "34551422";
    $scope.mostrarLogin = true;
    $scope.mostrarLogOut = false;
    $scope.mostrarVerificar = false;

    $scope.loguear = function() {
      //cuando preciona el boton registrarse bloqueo la interfaz con el spinner hasta que termine el proceso de registro
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 2
      });

      try
      {
      firebase.auth().signInWithEmailAndPassword($scope.loginData.email, $scope.loginData.password)
      .then(function(respuesta){
        console.info("RTA:", respuesta);
        //Cuando se loguea correctamente le seteo el uid al usuario
        Usuario.cargarUsuario(respuesta.uid);
        $timeout(function(){
          /*console.info("Esta Autenticado", respuesta.emailVerified);
          console.info("respuesta", respuesta);*/
          if(respuesta != undefined){
            /*$scope.mostrarLogin = false;
            if(respuesta.emailVerified)
            {
              $scope.mostrarLogOut = true;
            }else{
              $scope.mostrarVerificar = true;
            }*/
          $timeout(function() {
            console.info("usuario", Usuario.getUsuario());
            $ionicLoading.hide();
            $state.go('app.buscardesafios');
          }, 3000);
            
          }
        });
      },function (error){
          $timeout(function() {
            console.info("error: ", error);
            $ionicLoading.hide();
          }, 1000);
        });
      }catch(error){
        console.log("No se pudo completar el login");
        $ionicLoading.hide();
      }    
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

angular.module('starter.controllerregistro', [])


.controller('RegistroCtrl', function($scope, $timeout, $state, servicioABM, Usuario, $ionicLoading) {
    $scope.loginData={};
    $scope.loginData.nombre = "Horacio";
    $scope.loginData.email = "dillonhoraciodavid@gmail.com";
    $scope.loginData.password = "34551422";

    $scope.registrarse = function() {
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
        firebase.auth().createUserWithEmailAndPassword($scope.loginData.email, $scope.loginData.password)
        .then(function(respuesta){
          console.info("REGISTRO: ", respuesta);
          $timeout(function(){
            $scope.loginData.uid = respuesta.uid;
            servicioABM.altaUsuario($scope.loginData);
            $ionicLoading.hide();
            $state.go('app.login');
          });
        },function (error){
          $timeout(function() {
            switch (error.code)
            {
              case "auth/email-already-in-use":
                  console.log("El correo ya esta registrado.");
                break;

            }
            $ionicLoading.hide();
          }, 1000);
        });
      }catch(error){
        console.log("No se pudo completar el registro");
        $ionicLoading.hide();
      }

      //Por las dudas siempre intento ocultar el spinner pasados 10 seg.
      $timeout(function () {
        $ionicLoading.hide();
      }, 10000);
      
    }

});

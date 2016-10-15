angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
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

.controller('LoginFbCtrl', function($scope, $timeout) {
    $scope.loginData={};
    $scope.loginData.username = "dillonhoraciodavid@gmail.com";
    $scope.loginData.password = "34551422";
    $scope.mostrarLogin = true;
    $scope.mostrarLogOut = false;
    $scope.mostrarVerificar = false;

    $scope.loguear = function() {

      firebase.auth().signInWithEmailAndPassword($scope.loginData.username, $scope.loginData.password).catch(function(error) {
      console.info("error", error);
      }).then(function(respuesta){
        console.info("RTA:", respuesta);
        $timeout(function(){
          /*console.info("Esta Autenticado", respuesta.emailVerified);
          console.info("respuesta", respuesta);*/
          $scope.mostrarLogin = false;
          if(respuesta.emailVerified)
          {
            $scope.mostrarLogOut = true;
          }else{
            $scope.mostrarVerificar = true;
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
     firebase.auth().sendPasswordResetEmail($scope.loginData.username)
     .then(function(respuesta){
        console.info("respuestaReset", respuesta);
     }).catch(function(error){
      console.info("Se ropio el reset", error);

     });
     
    };
    
    $scope.verificarEmail = function() {
      alert("asd");
     
    };  

})

.controller('PlaylistsCtrl', function($scope) {

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});

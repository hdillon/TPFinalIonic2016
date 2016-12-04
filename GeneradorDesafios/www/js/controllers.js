angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopup) {
  $scope.loginData = {};
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = true;
    $scope.hasHeaderFabRight = true;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };



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

.controller('JugarCtrl', function($scope) {
   $scope.name = 'Sprite Generator for LED MATRIX 8x8';

  var ledButton = {
    value: '0',
    column: 0,
    row: 0
  };

  var ledMatrixColumnsCount = 8;
  var ledMatrixRowsCount = 8;

  $scope.spriteName = "Name";
  $scope.ledMatrixRows = [];
  $scope.code = "";

  $scope.init = function() {
    for (var rowIndex = 0; rowIndex < ledMatrixRowsCount; rowIndex++) {
      var ledMatrixRow = [];
      for (var columnIndex = 0; columnIndex < ledMatrixColumnsCount; columnIndex++) {
        var lb = angular.copy(ledButton);
        lb.column = columnIndex;
        lb.row = rowIndex;
        ledMatrixRow.push(lb);
      }
      $scope.ledMatrixRows.push(ledMatrixRow);
    }
    generateCode();
  };

  $scope.$watch('spriteName', function(newValue, oldValue) {
    if (newValue != oldValue) {
      generateCode();
    }
  }, true);

  $scope.setVal = function(btn) {
    if (btn.value == '0') {
      btn.value = '1';
    } else {
      btn.value = '0';
    }
    generateCode();
  };

  $scope.clear = function() {
    angular.forEach($scope.ledMatrixRows, function(val, key) {
      angular.forEach(val, function(col, key) {
        col.value = '0';
      });
    });
    generateCode();
  };

  var generateCode = function() {
    $scope.code = "byte sprite" + $scope.spriteName + "[] = {8, 8, ";

    angular.forEach($scope.ledMatrixRows, function(val, key) {
      var codePart = "B";
      angular.forEach(val, function(col, key) {

        codePart += col.value;
      });
      $scope.code += codePart;
      if(key!=(ledMatrixColumnsCount-1)){
        $scope.code += ",";
      }
    });

    $scope.code += "};";
  };

})

.controller('PerfilCtrl', function($scope) {

})

.controller('BuscarDesafiosCtrl', function($scope) {

})

.controller('MisDesafiosCtrl', function($scope) {

})


.controller('CrearDesafioCtrl', function($scope, $state, $stateParams) {
  $scope.jugar = function() {
    $state.go("app.jugar");
  };  

});

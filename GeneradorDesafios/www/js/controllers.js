angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout, $ionicPopup, Usuario, $ionicLoading, MiServicioFB) {
  $scope.loginData = {};
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

/*
for(var i = 0 ; i < 20 ; i++){
  $timeout(function () {
    console.info("USUARIO: ", Usuario.getUsuario());
  }, 10000 * i);
}
*/

//Si un retador agrega una partida en la base y el creador del desafio es el current user se muestra el popUp para comenzar el juego
MiServicioFB.Cargar('/Partidas')
  .on('child_added',function(snapshot)
  {
    console.info("partida: ",snapshot.val());
    if(snapshot.val().creador.email == Usuario.getUsuario().email){
      var alertPopup = $ionicPopup.alert({
         title: snapshot.val().retador.nombre + " aceptó tu desafío!",
         okText: "JUGAR"
      });

      alertPopup.then(function(res) {
        $state.go('app.jugar', {partida : JSON.stringify(snapshot.val())});

      });
    }
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



.controller('JugarCtrl', function($scope,$state, $stateParams, $timeout, Usuario, $ionicLoading, MiServicioFB) {
  if($stateParams.partida != "")
  {
    var partida = JSON.parse($stateParams.partida);
  }

  var ledButton = {
    value: '0',
    column: 0,
    row: 0
  };

  var contadorColumnas = 8;
  var contadorFilas = 8;
  var contadorApuestas = 0;

  $scope.spriteName = "Name";
  $scope.matriz = [];
  $scope.celdasSeleccionadas = [];
  $scope.code = "";

//Inicializa la matriz con ceros:
  $scope.init = function() {
    for (var indiceFila = 0; indiceFila < contadorFilas; indiceFila++) {
      var arrayFila = [];
      for (var indiceColumna = 0; indiceColumna < contadorColumnas; indiceColumna++) {
        var lb = angular.copy(ledButton);
        lb.column = indiceColumna;
        lb.row = indiceFila;
        arrayFila.push(lb);
      }
      $scope.matriz.push(arrayFila);
    }
    generateCode();
  };

  $scope.$watch('spriteName', function(newValue, oldValue) {
    if (newValue != oldValue) {
      generateCode();
    }
  }, true);

//invierte el valor de la celda seleccionada
  $scope.setVal = function(btn) {
    console.info("celda:", btn);
    if (btn.value == '0' && contadorApuestas < 4) {//por ahora limito las apuestas en la matriz a 4
      btn.value = '1';
      $scope.celdasSeleccionadas.push(btn);
    }
    contadorApuestas ++; 
    console.info("celdas ", $scope.celdasSeleccionadas);
    //generateCode();
  };

  $scope.clear = function() {
    angular.forEach($scope.matriz, function(val, key) {
      angular.forEach(val, function(col, key) {
        col.value = '0';
      });
    });
    generateCode();
  };

  var generateCode = function() {
    $scope.code = "";

    angular.forEach($scope.matriz, function(val, key) {
      var codePart = "B";
      angular.forEach(val, function(col, key) {

        codePart += col.value;
      });
      $scope.code += codePart;
      if(key!=(contadorColumnas-1)){
        $scope.code += ",";
      }
    });

    $scope.code += "};";
  };

  $scope.confirmarApuesta = function() {
    $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 2
  });
    MiServicioFB.Guardar("/Partidas/"+partida.id+"/retador/estrategia/", JSON.stringify($scope.celdasSeleccionadas))
    .then(function(resultado){
      $ionicLoading.hide();
    },function (error){
        console.log("Error!!");
        $ionicLoading.hide();
    });  

  };

})

.controller('PerfilCtrl', function($scope) {

});



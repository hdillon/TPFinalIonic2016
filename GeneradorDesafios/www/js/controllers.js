angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout, $ionicPopup, Usuario, $ionicLoading, MiServicioFB) {
  $scope.loginData = {};
  $scope.partida = {};
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
      $scope.partida = snapshot.val();
      $scope.partida.player = 'creador';
      var alertPopup = $ionicPopup.alert({
         title: snapshot.val().retador.nombre + " aceptó tu desafío!",
         okText: "JUGAR"
      });

      alertPopup.then(function(res) {
        $state.go('app.jugar', {partida : JSON.stringify($scope.partida)});

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



.controller('JugarCtrl', function($scope,$state, $stateParams, $timeout, $ionicPopup, Usuario, $ionicLoading, MiServicioFB) {
  if($stateParams.partida != "")
  {
    $scope.partida = JSON.parse($stateParams.partida);
  }

  $scope.matriz = [];
  $scope.celdasSeleccionadas = [];
  $scope.disparos = [];
  $scope.flagInformarAlUsuario = false;//lo uso para validar si tengo que mostrar un popup según el evento que se dispare
  var contadorColumnas = 8;
  var contadorFilas = 8;
  var contadorApuestas = 0;
  $scope.metodoMatriz = "setVal";//Cuando carga el controller la primera vez, se usa este método en la matriz para elegir las pocisiones de juego
  var ledButton = {
    value: '0',
    column: 0,
    row: 0
  };

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
  };

//invierte el valor de la celda seleccionada
  $scope.setVal = function(btn) {
    console.info("celda:", btn);
    if (btn.value == '0' && contadorApuestas < 4) {//por ahora limito las apuestas en la matriz a 4
      btn.value = '1';
      $scope.celdasSeleccionadas.push(btn);
    }
    contadorApuestas ++; 
    console.info("celdas ", $scope.celdasSeleccionadas);
  };

  $scope.clear = function() {
    angular.forEach($scope.matriz, function(val, key) {
      angular.forEach(val, function(col, key) {
        col.value = '0';
      });
    });
  };

  /*var generateCode = function() {
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
  };*/

  $scope.confirmarApuesta = function() {
    $ionicLoading.show({content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 2 });
    MiServicioFB.Guardar("/Partidas/"+$scope.partida.id+"/"+$scope.partida.player+"/estrategia/", JSON.stringify($scope.celdasSeleccionadas))
    .then(function(resultado){
      $ionicLoading.hide();
      $scope.metodoMatriz = "guardarJugada";//una vez que confirma la apuesta el método por defecto en la matriz va a ser el que guarde cada disparo
      $scope.clear(); //una vez que confirma la apuesta limpio la matriz para que comience a jugar
    },function (error){
        console.log("Error!!");
        $ionicLoading.hide();
    });  
  };

  //Guardo en la base cada vez que el jugador dispara
  $scope.guardarJugada = function(btn) {
    console.info("celda:", btn);
    $scope.disparos.push(btn);//voy acumulando los disparos del player
    $scope.flagInformarAlUsuario = false;
    MiServicioFB.Guardar("/Partidas/"+$scope.partida.id+"/"+$scope.partida.player+"/disparos/", JSON.stringify($scope.disparos))
    .then(function(resultado){
      $ionicLoading.hide();
      $scope.clear(); //una vez que confirma la apuesta limpio la matriz para que comience a jugar
    },function (error){
        console.log("Error!!");
        $ionicLoading.hide();
    }); 
 
    $timeout(function () {//Le agrego un timeout de 2 seg para darle tiempo a que se ejecute completamente los eventos que guardan el ultimo en jugar
    //voy actualizando el flag en la base para saber quién fué el último que jugó (creador ó retador)
    $scope.flagInformarAlUsuario = true;
    MiServicioFB.Guardar("/Partidas/"+$scope.partida.id+"/ultimoenjugar/", $scope.partida.player)
    .then(function(resultado){
      $ionicLoading.hide();
      $scope.clear(); //una vez que confirma la apuesta limpio la matriz para que comience a jugar
    },function (error){
        console.log("Error!!");
        $ionicLoading.hide();
    });  
    }, 2000); 
  };

//CON ESTE EVENTO VOY MANEJANDO LOS TURNOS DE C/PLAYER
  MiServicioFB.Cargar('/Partidas')//capturo cada vez que hay un cambio en alguna partida
  .on('child_changed',function(snapshot)
  {
    console.info("$scope.flagInformarAlUsuario: ",$scope.flagInformarAlUsuario);
    if(snapshot.val().id == $scope.partida.id){
      if($scope.flagInformarAlUsuario && $scope.partida.player != snapshot.val().ultimoenjugar && snapshot.val().ultimoenjugar != undefined){//acá verifico si el que disparó el evento es el otro usuario!  
        var alertPopup = $ionicPopup.alert({title: snapshot.val().ultimoenjugar + " Jugó!", okText: "JUGAR"});
        $scope.stopTimer();
        $scope.startTimer();
        //ACÁ DEBERÍA DESBLOQUEAR LA PANTALLA Y COMENZAR A CORRER  EL TIMER
      }else{
        $scope.stopTimer();
        //ACÁ DEBERÍA BLOQUEAR LA PANTALLA DEL QUE JUGÓ QUE QUEDA A LA ESPERA DE QUE JUEGUE EL CONTRARIO
      }
      console.log(JSON.parse(snapshot.val().retador.estrategia));
     /* alertPopup.then(function(res) { ESTE POPUP FALLA SI ENTRA POR EL ELSE PORQUE NO VA A ESTAR DEFINIDO
        //$state.go('app.jugar', {partida : JSON.stringify($scope.partida)});
      });*/
    }
  });


  //TIMER:
  $scope.counter = 9000;
  var mytimeout = null; // the current timeoutID
    $scope.onTimeout = function() {
      if($scope.counter ===  0) {
          $scope.$broadcast('timer-stopped', 0);
          $timeout.cancel(mytimeout);
          return;
      }
      $scope.counter--;
      mytimeout = $timeout($scope.onTimeout, 1000);
    };

    $scope.startTimer = function() {
      mytimeout = $timeout($scope.onTimeout, 1000);
    };
    // stops and resets the current timer
    $scope.stopTimer = function() {
      $scope.$broadcast('timer-stopped', $scope.counter);
      $scope.counter = 9000;
      $timeout.cancel(mytimeout);
    };
    // triggered, when the timer stops, you can do something here, maybe show a visual indicator or vibrate the device
    $scope.$on('timer-stopped', function(event, remaining) {
        if(remaining === 0) {
          var alertPopup = $ionicPopup.alert({
           title: 'Se te agotó el tiempo! :(',
           okText: "ACEPTAR"
          });
          alertPopup.then(function(res) {
            $state.go('app.buscardesafios');//TODO:dar por ganado al contrario!
          });
        }
    });

  $scope.startTimer();//apenas carga la vista del juego comienza a contar el tiempo

})

.controller('PerfilCtrl', function($scope) {

});



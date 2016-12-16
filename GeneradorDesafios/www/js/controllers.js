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
      $scope.partida.rival = 'retador';
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
  $scope._misBarcos = {};
  $scope._disparos = {};
  $scope.contadorDisparosPlayer = 0;
  $scope.contadorDisparosRival = 0;
  $scope.disparoRival = "";
  $scope.arrayLetras = ['A','B','C','D','E'];
  $scope.flagInformarAlUsuario = false;//lo uso para validar si tengo que mostrar un popup según el evento que se dispare
  var contadorColumnas = 5;
  var contadorFilas = 5;
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
        lb.column = $scope.arrayLetras[indiceColumna];
        lb.row = indiceFila+1;
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

      switch(contadorApuestas){
        case 0:
          $scope._misBarcos.jugada1 = (btn.column+btn.row);
        break;
        case 1:
          $scope._misBarcos.jugada2 = (btn.column+btn.row);
        break;
        case 2:
          $scope._misBarcos.jugada3 = (btn.column+btn.row);
        break;
        case 3:
          $scope._misBarcos.jugada4 = (btn.column+btn.row);
        break;
      }
    }
    contadorApuestas ++; 
    console.info("Mi Estrategia", $scope._misBarcos);
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
    MiServicioFB.Guardar("/Partidas/"+$scope.partida.id+"/"+$scope.partida.player+"/estrategia/", $scope._misBarcos)
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
    $scope._disparos[$scope.contadorDisparosPlayer] = btn.column+btn.row;//voy acumulando los disparos del player
    $scope.contadorDisparosPlayer ++;
    $scope.flagInformarAlUsuario = false;
    MiServicioFB.Guardar("/Partidas/"+$scope.partida.id+"/"+$scope.partida.player+"/disparos/", $scope._disparos)
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
    if(snapshot.val().id == $scope.partida.id){
      if(snapshot.val().ganador != undefined){//Siempre que se actualiza algo en la partida verifico si ya ganó alguno
        if(snapshot.val().ganador == $scope.partida.player){
          var alertPopup = $ionicPopup.alert({title: "GANASTE!", okText: "ACEPTAR"});
          $scope.actualizarCredito("ganaste");
        }else{
          var alertPopup = $ionicPopup.alert({title: "PERDISTE! :(", okText: "ACEPTAR"});
          $scope.actualizarCredito("perdiste");
        }
        alertPopup.then(function(res) {
            $state.go('app.buscardesafios');
        });
      }

      if($scope.flagInformarAlUsuario && $scope.partida.player != snapshot.val().ultimoenjugar && snapshot.val().ultimoenjugar != undefined){//acá verifico si el que disparó el evento es el otro usuario!  
        var alertPopup = $ionicPopup.alert({title: snapshot.val().ultimoenjugar + " Jugó!", okText: "JUGAR"});
        $scope.stopTimer();
        $scope.startTimer();
        //ACÁ DEBERÍA DESBLOQUEAR LA PANTALLA Y COMENZAR A CORRER  EL TIMER
        console.info("ULTIMO DISPARO DEL RIVAL: ", snapshot.val()[$scope.partida.rival].disparos[$scope.contadorDisparosRival]);
        $scope.disparoRival = snapshot.val()[$scope.partida.rival].disparos[$scope.contadorDisparosRival];
        $scope.contadorDisparosRival ++;

        $scope.verificarSiPerdi();
        
        

      }else{
        $scope.stopTimer();
        //ACÁ DEBERÍA BLOQUEAR LA PANTALLA DEL QUE JUGÓ QUE QUEDA A LA ESPERA DE QUE JUEGUE EL CONTRARIO
      }
      //console.log(snapshot.val().retador.estrategia);
     /* alertPopup.then(function(res) { ESTE POPUP FALLA SI ENTRA POR EL ELSE PORQUE NO VA A ESTAR DEFINIDO
        //$state.go('app.jugar', {partida : JSON.stringify($scope.partida)});
      });*/
    }
  });

  $scope.verificarSiPerdi = function() {
    for(var k in $scope._misBarcos) {
      if ($scope._misBarcos[k] == $scope.disparoRival) {
          delete $scope._misBarcos[k];
          console.info("Estrategia actualizada", $scope._misBarcos);
          break;
        } 
       console.log("agua");
      }

    if(angular.equals($scope._misBarcos, {})){//Verifico si se queda sin barcos para informar que perdió!
      $ionicLoading.show({content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 2 });
      MiServicioFB.Guardar("/Partidas/"+$scope.partida.id+"/ganador/", $scope.partida.rival)
      .then(function(resultado){
        $ionicLoading.hide();
      },function (error){
          console.log("Error!!");
          $ionicLoading.hide();
      });  
    }
  }

  $scope.actualizarCredito = function(resultadoPartida) {
    var updates = {};
    var credito;
    var updates = {};
    if(resultadoPartida == "ganaste"){
      credito = Number(Usuario.getUsuario().credito) + Number($scope.partida.apuesta); 
    }else{
      credito = Number(Usuario.getUsuario().credito) - Number($scope.partida.apuesta); 
    }

    updates['/Usuarios/' + Usuario.getUsuario().id +"/credito" ] = credito;
    /*updates['/Usuarios/' + Usuario.getUsuario().id +"/victorias" ] = ;
    updates['/Usuarios/' + Usuario.getUsuario().id +"/derrotas" ] = ;*/

      MiServicioFB.Editar(updates)
      .then(function(resultado){
        $ionicLoading.hide();
      },function (error){
        console.log("Error!!");
        $ionicLoading.hide();
      });  
  }


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



angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout, $ionicPopup, Usuario, $ionicLoading, MiServicioFB) {
  $scope.loginData = {};
  $scope.partida = {};
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

//Si un retador agrega una partida en la base y el creador del desafio es el current user se muestra el popUp para comenzar el juego
  MiServicioFB.Cargar('/Partidas')
  .on('child_added',function(snapshot)
  {
    console.info("partida: ",snapshot.val());
    if(snapshot.val().creador.email == Usuario.getUsuario().email){
      $scope.partida = snapshot.val();
      $scope.partida.player = 'creador';
      $scope.partida.rival = 'retador';
      var alertPopup = $ionicPopup.confirm({
         title: snapshot.val().retador.nombre + " aceptó tu desafío!",
         okText: "JUGAR",
         cancelText: 'RECHAZAR'
      });

      alertPopup.then(function(res) {
        console.info("RES: ", res);
        if(res){//si aceptó jugar la partida
          $state.go('app.jugar', {partida : JSON.stringify($scope.partida)});
        }else{
          MiServicioFB.Borrar("/Partidas/"+$scope.partida.id)//Si rechaza la invitación, borro de la base el nodo partida que creó el retador
          .then(function(resultado){
            $ionicLoading.hide();
          },function (error){
            console.log("Error!!");
            $ionicLoading.hide();
          });  
        }

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
    $scope.partida = JSON.parse($stateParams.partida);

  $scope.matriz = [];
  $scope._misBarcos = {};
  $scope._disparos = {};
  $scope.contadorDisparosPlayer = 0;
  $scope.contadorDisparosRival = 0;
  $scope.disparoRival = "";
  $scope.arrayLetras = ['A','B','C','D','E'];
  $scope.flagInformarAlUsuario = true;//lo uso para validar si tengo que mostrar un popup según el evento que se dispare
  $scope.flagConfirmoEstrategia = false;
  var contadorColumnas = 5;
  var contadorFilas = 5;
  $scope.contadorBarcosEstrategia = 0;
  $scope.metodoMatriz = "setVal";//Cuando carga el controller la primera vez, se usa este método en la matriz para elegir las pocisiones de juego
  var ledButton = {value: '0', column: 0, row: 0 };

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
    if (btn.value == '0' && $scope.contadorBarcosEstrategia < 4) {//por ahora limito las apuestas en la matriz a 4
      btn.value = '1';

      switch($scope.contadorBarcosEstrategia){
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
      $scope.contadorBarcosEstrategia ++; 
    }
    console.info("esfdfsf:", $scope.contadorBarcosEstrategia);
    //console.info("Mi Estrategia", $scope._misBarcos);
  };

  $scope.clear = function() {//Limpio la matriz
    $scope.contadorBarcosEstrategia ++; 
    angular.forEach($scope.matriz, function(val, key) {
      angular.forEach(val, function(col, key) {
        col.value = '0';
      });
    });
  };

  $scope.confirmarEstrategia = function() {
    MiServicioFB.Guardar("/Partidas/"+$scope.partida.id+"/"+$scope.partida.player+"/estrategia/", $scope._misBarcos)
    .then(function(resultado){
      $scope.metodoMatriz = "guardarJugada";//una vez que confirma la apuesta el método por defecto en la matriz va a ser el que guarde cada disparo
      $scope.clear(); //una vez que confirma la apuesta limpio la matriz para que comience a jugar
      if($scope.partida.player == "retador")//El primer turno siempre es para el creador de la partida
        $ionicLoading.show({content: 'Loading', template: 'Esperando que ' + $scope.partida[$scope.partida.rival].nombre + ' juegue...', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 2 });

    },function (error){
      console.log("Error!!");
      $ionicLoading.hide();
    });  
  };

  //Guardo en la base cada vez que el jugador dispara
  $scope.guardarJugada = function(btn) {
    btn.value = "1";
    $ionicLoading.show({content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 2 });
    $scope._disparos[$scope.contadorDisparosPlayer] = btn.column+btn.row;//voy acumulando los disparos del player
    $scope.contadorDisparosPlayer ++;
    $scope.flagInformarAlUsuario = false;
    MiServicioFB.Guardar("/Partidas/"+$scope.partida.id+"/"+$scope.partida.player+"/disparos/", $scope._disparos)
    .then(function(resultado){
  
    },function (error){
      console.log("Error!!");
      $ionicLoading.hide();
    }); 
 
    $timeout(function () {//Le agrego un timeout de 2 seg para darle tiempo a que se ejecute completamente los eventos que guardan el ultimo en jugar
      $ionicLoading.show({content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 2 });
      $scope.flagInformarAlUsuario = true;//voy actualizando el flag en la base para saber quién fué el último que jugó (creador ó retador)
      MiServicioFB.Guardar("/Partidas/"+$scope.partida.id+"/ultimoenjugar/", $scope.partida.player)
      .then(function(resultado){

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
          var alertPopup = $ionicPopup.alert({title: "GANASTE " + $scope.partida.apuesta + " CREDITOS!", okText: "ACEPTAR"});
          $scope.actualizarCredito("ganaste");
          $scope.actualizarEstadistica("victoria");
        }else{
          var alertPopup = $ionicPopup.alert({title: "PERDISTE! :(", okText: "ACEPTAR"});
          $scope.actualizarCredito("perdiste");
          $scope.actualizarEstadistica("derrota");
        }
        alertPopup.then(function(res) {
          $state.go('app.buscardesafios');
        });
      }

      if($scope.flagInformarAlUsuario && $scope.partida.player != snapshot.val().ultimoenjugar && snapshot.val().ultimoenjugar != undefined){//acá verifico si el que disparó el evento es el otro usuario!  
        $ionicLoading.hide();
        //var alertPopup = $ionicPopup.alert({title: $scope.partida[$scope.partida.rival].nombre + " Jugó!", okText: "JUGAR"});
        $scope.stopTimer();
        $scope.startTimer();
        //ACÁ DEBERÍA DESBLOQUEAR LA PANTALLA Y COMENZAR A CORRER  EL TIMER
        console.info("ULTIMO DISPARO DEL RIVAL: ", snapshot.val()[$scope.partida.rival].disparos[$scope.contadorDisparosRival]);
        $scope.disparoRival = snapshot.val()[$scope.partida.rival].disparos[$scope.contadorDisparosRival];
        $scope.contadorDisparosRival ++;

        $scope.verificarSiPerdi();

      }else{//BLOQUEO LA PANTALLA DEL QUE JUGÓ QUE QUEDA A LA ESPERA DE QUE JUEGUE EL CONTRARIO
        $scope.stopTimer();
        if(snapshot.val().ultimoenjugar != undefined && $scope.flagInformarAlUsuario){
          $ionicLoading.hide();
          $ionicLoading.show({content: 'Loading', template: 'Esperando que ' + $scope.partida[$scope.partida.rival].nombre + ' juegue...', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 2 });
        }

        //Verifico que el retador haya confirmado la estrategia antes de dejar jugar al creador
        if(!$scope.flagConfirmoEstrategia && $scope.partida.player == "creador"){
          if(snapshot.val()[$scope.partida.rival].estrategia == undefined)
            $ionicLoading.show({content: 'Loading', template: 'Esperando que ' + $scope.partida[$scope.partida.rival].nombre + ' confirme su estrategia...', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 2 });
          else{
            $ionicLoading.hide();
            $scope.flagConfirmoEstrategia = true;
            var alertPopup = $ionicPopup.alert({title: "INICIA EL JUEGO!", okText: "ACEPTAR"});
          }
        }
        


      }

    }
  });


//EN CASO DE QUE EL CREADOR RECHACE LA INVITACION SE BORRA LA PARTIDA Y SE AVISA AL RETADOR:
  MiServicioFB.Cargar('/Partidas')
  .on("child_removed", function(snapshot) {
    if(snapshot.val().id == $scope.partida.id){
      var alertPopup = $ionicPopup.alert({title: $scope.partida.rival + " Rechazó la invitación", okText: "ACEPTAR"});
      alertPopup.then(function(res) {
          $state.go('app.buscardesafios');
      });
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


  $scope.actualizarEstadistica = function(resultadoPartida) {
    var updates = {};
    var updates = {};
    if(resultadoPartida == "victoria"){
      var victorias = Number(Usuario.getUsuario().victorias) + 1; 
      updates['/Usuarios/' + Usuario.getUsuario().id +"/victorias" ] = victorias;
    }else{
      var derrotas = Number(Usuario.getUsuario().derrotas) + 1; 
       updates['/Usuarios/' + Usuario.getUsuario().id +"/derrotas" ] = derrotas;
    }

      MiServicioFB.Editar(updates)
      .then(function(resultado){
        $ionicLoading.hide();
      },function (error){
        console.log("Error!!");
        $ionicLoading.hide();
      });  
  }


  $scope.actualizarEstadoDesafio = function() {
    var updates = {};
    updates['/Desafios/' + $scope.partida.id +"/activo" ] = false;

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

  if($scope.partida.player == "creador")//si el creador aceptó el desafío, lo paso a inactivo
    $scope.actualizarEstadoDesafio();
})

.controller('PerfilCtrl', function($scope, Usuario) {
  $scope.email = Usuario.getUsuario().email;
  $scope.nombre = Usuario.getUsuario().nombre;
  $scope.credito = Usuario.getUsuario().credito;
  $scope.victorias = Usuario.getUsuario().victorias;
  $scope.derrotas = Usuario.getUsuario().derrotas;
});



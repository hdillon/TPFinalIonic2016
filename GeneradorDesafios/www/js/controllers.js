angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, Usuario, $ionicLoading, MiServicioFB) {
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
MiServicioFB.Cargar('/Partidas')
  .on('child_added',function(snapshot)
  {
    console.info("changed",snapshot.val());
    console.info("crador",snapshot.val().creador.email);
    console.info("currentusr",Usuario.getUsuario().email);
    if(snapshot.val().creador.email == Usuario.getUsuario().email)
      alert(snapshot.val().retador.nombre + " aceptó tu desafío!");
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



.controller('JugarCtrl', function($scope) {
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
    $scope.code = "";

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

});



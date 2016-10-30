angular.module('starter.services', [])

.factory('Usuario', function () {
        var usuario = {};
        usuario.nombre = 'NOLOGUEADO';
        usuario.uid = '';
        usuario.creditos;

        usuario.setNombre = function (value) {
            this.nombre = value;
        };

        usuario.setUid = function (value) {
            this.uid = value;
        };

        usuario.setCredito = function (value) {
            this.creditos = value;
        };

        return usuario;
})

.service('servicioABM', function ($crypto, Usuario, $firebaseArray) {
    var FBRef = new Firebase("https://generadordesafios.firebaseio.com/");

    this.altaCredito = function(cantidadCredito){
        var encrypted = $crypto.encrypt(Usuario.nombre + ' ' + fechaActual() + '$' + cantidadCredito);
        var decrypted = $crypto.decrypt(encrypted);
        console.info("encrypted ",encrypted);
        console.info("decrypted",decrypted);
        FBRef.child('Creditos')
        .push({ 
          "codigo": $crypto.encrypt(Usuario.nombre + ' ' + fechaActual() + '$' + cantidadCredito),
          "usado": false
        });
    }

    this.cargarCredito = function(codigo){
        var codigoDesencriptado = $crypto.decrypt(codigo);
        var cantidadCredito = codigoDesencriptado.split("$");
        cantidadCredito = cantidadCredito[1];

    }

    function fechaActual(){
        now = new Date();
        year = "" + now.getFullYear();
        month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
        day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
        hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
        minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
        second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    }

    this.altaUsuario = function(usuario){
        FBRef.child('Usuarios').child(usuario.uid)
        .set({ 
          "email": usuario.email,
          "credito": 1000
        });
    }

    this.cargarUsuario = function(uid){
        var usuario = FBRef.child('Usuarios');
        var datosFBArray = $firebaseArray(FBRef.child('Usuarios'));
        console.info("USUARIO OBTENIDO: " , datosFBArray); 

        FBRef.child('Usuarios').once("value", function(snapshot) {
        console.info("Datos", snapshot.val());
        var snap = snapshot.val();

        

        console.info("snapp", snap.SdThmrKJBpXhLtwaA8mF2Gsfvhz1.credito);

        
        
        });

    }

});

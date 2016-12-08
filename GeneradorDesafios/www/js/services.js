angular.module('starter.services', [])

.factory('Usuario', function ($crypto) {
        var usuario = {};
        var FBRefUsuario;

        usuario.cargarUsuario = function(uid){
            console.log("uid", uid);
            FBRefUsuario = new Firebase("https://generadordesafios.firebaseio.com/Usuarios/" + uid + "/");

            FBRefUsuario.once("value", function(snapshot) {
            console.info("Usuario", snapshot.val());
            usuario = snapshot.val();

            console.info("snap: ", usuario);
            console.info("email: ", usuario.email);
            console.info("credito: ", usuario.credito);
            
            });

        }

        usuario.cargarCredito = function (codigo) {
            var codigoDesencriptado = $crypto.decrypt(codigo);
            var cantidadCredito = codigoDesencriptado.split("$");
            cantidadCredito = usuario.credito + Number(cantidadCredito[1]); //sumo el credito que ya tenía el usuario con el del código QR
            FBRefUsuario.update({
                credito : cantidadCredito
            });
        }



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
          "nombre": usuario.nombre,
          "email": usuario.email,
          "credito": 1000
        });
    }

    

});

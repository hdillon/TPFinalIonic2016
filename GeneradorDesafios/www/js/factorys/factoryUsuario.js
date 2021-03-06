angular.module('starter.factoryUsuario', [])

.factory('Usuario', function ($crypto) {
    var usuario = {};
    var FBRefUsuario;

    usuario.getUsuario = function(){
        return usuario;
    }

    usuario.cargarUsuario = function(uid){
        console.log("uid", uid);
        FBRefUsuario = new Firebase("https://generadordesafios.firebaseio.com/Usuarios/" + uid + "/");

        FBRefUsuario.once("value", function(snapshot) {
        console.info("Usuario", snapshot.val());
        usuario = snapshot.val();
        
        });

    }

    usuario.cargarCredito = function (obj) {
        var codigoDesencriptado = $crypto.decrypt(obj.codigo);
        var cantidadCredito = codigoDesencriptado.split("$");
        cantidadCredito = usuario.credito + Number(cantidadCredito[1]); //sumo el credito que ya tenía el usuario con el del código QR
        FBRefUsuario.update({
            credito : cantidadCredito
        });

        var updateEstadoCredito = {};

        updateEstadoCredito['/Creditos/' + obj.id + "/usado"] = true;
        firebase.database().ref().update(updateEstadoCredito);
    }

    return usuario;
})
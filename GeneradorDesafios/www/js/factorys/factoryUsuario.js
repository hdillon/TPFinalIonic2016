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
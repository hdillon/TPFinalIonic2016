angular.module('starter.services', [])

.service('servicioABM', function ($crypto, Usuario, $firebaseArray) {
    var FBRef = new Firebase("https://generadordesafios.firebaseio.com/");

    this.altaUsuario = function(usuario){
        FBRef.child('Usuarios').child(usuario.uid)
        .set({
          "id": usuario.uid, 
          "nombre": usuario.nombre,
          "email": usuario.email,
          "credito": 1000
        });
    }

    

});

eventListener();

function eventListener() {
  document
    .querySelector("#formulario")
    .addEventListener("submit", validarRegistro);
}

function validarRegistro(e) {
  e.preventDefault();
  var usuario = document.querySelector("#usuario").value,
    password = document.querySelector("#password").value;
  tipo = document.querySelector("#tipo").value;
  if (usuario === "" || password === "") {
    //La validacion fallo
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Al parecer olvidaste completar un campo",
    });
  } else {
    //ambos campos correctos, comenzar llamado a Ajax

    //DAtos para enviar al servidor
    var datos = new FormData();
    datos.append("usuario", usuario);
    datos.append("password", password);
    datos.append("accion", tipo);

    //Crear llamado a Ajax
    //Crear conexion
    var xhr = new XMLHttpRequest();
    //Abrir conexion
    xhr.open("POST", "inc/modelos/modelo-admin.php", true);
    // Retorno de datos
    xhr.onload = function () {
      if (this.status === 200) {
        var respuesta = JSON.parse(xhr.responseText);

        if (respuesta.respuesta === "correcto") {
          //si es un nuevo usuario
          if (respuesta.tipo === "crear") {
            Swal.fire(
              "Genial!",
              "El usuario fue creado correctamente!",
              "success"
            );
          } else if (respuesta.tipo === "login") {
            Swal.fire(
              "Genial!",
              "Presiona OK para continuar al dashboard",
              "success"
            ).then((resultado) => {
              if (resultado) {
                window.location.href = "index.php";
              }
            });
          }
        } else {
          //Error
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Al parecer hubo un error",
          });
        }
      }
    };
    //Enviar la peticion
    xhr.send(datos);
  }
}

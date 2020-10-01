eventListeners();

var listaProyectos = document.querySelector("ul#proyectos");

function eventListeners() {
  //boton para crear proyecto
  document
    .querySelector(".crear-proyecto a")
    .addEventListener("click", nuevoProyecto);

  //Boton para nueva tarea
  document
    .querySelector(".nueva-tarea")
    .addEventListener("click", agregarTarea);

  //botones para las acciones de las tareas
  document
    .querySelector(".listado-pendientes")
    .addEventListener("click", accionesTareas);
}

function nuevoProyecto(e) {
  e.preventDefault();

  // crea un <input> para el nombre del nuevo proyecto
  var nuevoProyecto = document.createElement("li");
  nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
  listaProyectos.appendChild(nuevoProyecto);

  //Seleccionar el ID con el nuevo proyecto
  var inputNuevoProyecto = document.querySelector("#nuevo-proyecto");

  //Al presionar ENTER, crear el proyecto
  inputNuevoProyecto.addEventListener("keypress", function (e) {
    var tecla = e.which || e.keyCode;
    if (tecla === 13) {
      guardarProyectoDB(inputNuevoProyecto.value);
      listaProyectos.removeChild(nuevoProyecto);
    }
  });
}

function guardarProyectoDB(nombreProyecto) {
  //crear llamado a AJax
  var xhr = new XMLHttpRequest();
  //Enviar datos via FormData
  var datos = new FormData();
  datos.append("proyecto", nombreProyecto);
  datos.append("accion", "crear");
  //Abrir la conexion
  xhr.open("POST", "inc/modelos/modelo-proyecto.php", true);
  //CArga
  xhr.onload = function () {
    if (this.status === 200) {
      //obtener datos de la respuesta
      var respuesta = JSON.parse(xhr.responseText);
      var proyecto = respuesta.nombre_proyecto,
        id_proyecto = respuesta.id_insertado,
        tipo = respuesta.tipo,
        resultado = respuesta.respuesta;
      //comprobando la insercion
      if (resultado === "correcto") {
        //Exitoso
        if (tipo === "crear") {
          //se creo un nuevo proyecto
          //Inyectar en el HTML

          var nuevoProyecto = document.createElement("li");
          nuevoProyecto.innerHTML = `
            <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
            ${proyecto}
            </a>`;
          listaProyectos.appendChild(nuevoProyecto);
          //Enviar alerta
          Swal.fire(
            "Genial!",
            "El proyecto: " + proyecto + " se creó correctamente",
            "success"
          ).then((resultado) => {
            //redireccionar al crear proyecto
            if (resultado.value) {
              window.location.href = "index.php?id_proyecto=" + id_proyecto;
            }
          });
        } else {
          //se actualiza o elimina el proyecto
        }
      } else {
        //error
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Al parecer hubo un error",
        });
      }
    }
  };

  //Enviar consulta
  xhr.send(datos);

  //Inyectar el HTML
  var nuevoProyecto = document.createElement("li");
  nuevoProyecto.innerHTML = `<a href=#> ${nombreProyecto} </a>`;
  listaProyectos.appendChild(nuevoProyecto);
}

//Agregar nueva tarea al proyecto actual

function agregarTarea(e) {
  e.preventDefault();
  var nombreTarea = document.querySelector(".nombre-tarea").value;
  //validar que el campo tenga algo
  if (nombreTarea === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Al parecer no has cargado contenido en tu tarea",
    });
  } else {
    //Crear llamado Ajax
    var xhr = new XMLHttpRequest();
    //Crear form data
    var datos = new FormData();
    datos.append("tarea", nombreTarea);
    datos.append("accion", "crear");
    datos.append("id_proyecto", document.querySelector("#id_proyecto").value);

    //abrir la conexion
    xhr.open("POST", "inc/modelos/modelo-tareas.php", true);
    //ejecucion
    xhr.onload = function () {
      if (this.status === 200) {
        var respuesta = JSON.parse(xhr.responseText);
        //Asignar resultados
        var resultado = respuesta.respuesta,
          tarea = respuesta.tarea,
          id_insertado = respuesta.id_insertado,
          tipo = respuesta.tipo;

        if (resultado === "correcto") {
          //Se agregó correctamente
          if (tipo === "crear") {
            //lanzar alerta
            Swal.fire(
              "Genial!",
              "La tarea: " + tarea + " se creó correctamente",
              "success"
            );
            //Seleccionar parrafo con Lista vacia
            var parrafoListaVacia = document.querySelectorAll(".lista-vacia");
            if (parrafoListaVacia.length > 0) {
              document.querySelector(".lista-vacia").remove();
            }
            //construir el template
            var nuevaTarea = document.createElement("li");
            //Agregamos el ID
            nuevaTarea.id = "tarea:" + id_insertado;
            //Agregar la clase
            nuevaTarea.classList.add("tarea");
            //construir en el HTML
            nuevaTarea.innerHTML = `<p>${tarea}<p>
              <div class="acciones">
                <i class="far fa-check-circle"></i>
                <i class="fas fa-trash"></i>
              </div>`;

            //Agregarlo al HTML
            var listado = document.querySelector(".listado-pendientes ul");
            listado.appendChild(nuevaTarea);
            //Limpiar el formulario
            document.querySelector(".agregar-tarea").reset();
          }
        } else {
          //Hubo error
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Al parecer ha habido un error",
          });
        }
      }
    };
    //Enviar la consulta
    xhr.send(datos);
  }
}

//Cambia el estado de las tareas o las elimina
function accionesTareas(e) {
  e.preventDefault();
  if (e.target.classList.contains("fa-check-circle")) {
    if (e.target.classList.contains("completo")) {
      e.target.classList.remove("completo");
      cambiarEstadoTarea(e.target, 0);
    } else {
      e.target.classList.add("completo");
      cambiarEstadoTarea(e.target, 1);
    }
  }
  if (e.target.classList.contains("fa-trash")) {
    Swal.fire({
      title: "Estás seguro?",
      text: "Esto no se puede revertir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, boooorrar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        var tareaEliminar = e.target.parentElement.parentElement;

        //Borrar de BD
        eliminarTareaBD(tareaEliminar);
        //Borrar del HTML
        tareaEliminar.remove();

        Swal.fire("Borrado!", "La tarea ha sido eliminada", "success");
      }
    });
  }
}

//Completa o descompleta tarea

function cambiarEstadoTarea(tarea, estado) {
  var idTarea = tarea.parentElement.parentElement.id.split(":");

  //crear llamado a Ajax
  var xhr = new XMLHttpRequest();

  //
  var datos = new FormData();
  datos.append("id", idTarea[1]);
  datos.append("accion", "actualizar");
  datos.append("estado", estado);

  //Abrir la conexion
  xhr.open("POST", "inc/modelos/modelo-tareas.php", true);

  xhr.onload = function () {
    if (this.status === 200) {
      console.log(JSON.parse(xhr.responseText));
    }
  };

  //enviar la peticion
  xhr.send(datos);
}

//Eliminar tarea de base de datos
function eliminarTareaBD(tarea) {
  var idTarea = tarea.id.split(":");

  //crear llamado a Ajax
  var xhr = new XMLHttpRequest();

  //
  var datos = new FormData();
  datos.append("id", idTarea[1]);
  datos.append("accion", "eliminar");

  //Abrir la conexion
  xhr.open("POST", "inc/modelos/modelo-tareas.php", true);

  xhr.onload = function () {
    if (this.status === 200) {
      console.log(JSON.parse(xhr.responseText));

      //Comprobar que haya tareas restantes
      var tareasRestantes = document.querySelectorAll("li.tarea");
      if (tareasRestantes.length === 0) {
        document.querySelector(".listado-pendientes ul").innerHTML =
          "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
      }
    }
  };

  //enviar la peticion
  xhr.send(datos);
}

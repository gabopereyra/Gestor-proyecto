<?php

//Obtiene la pagina actual que se consulta
function obtenerPagina()
{
    $archivo = basename($_SERVER['PHP_SELF']);
    $pagina = str_replace(".php", "", $archivo);
    return $pagina;
}

//Se generan consultas para obtener todos los proyectos
function obtenerProyecto()
{
    include 'conexion.php';
    try {
        return $conn->query('SELECT id, nombre FROM proyectos');
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
        return false;
    }
}

//Obtener el nombre del proyecto
function obtenerNombreProyecto($id = null)
{
    include 'conexion.php';
    try {
        return $conn->query("SELECT nombre FROM proyectos WHERE id = {$id}");
    } catch (Exception $e) {
        echo "Error! : " . $e->getMessage();
        return false;
    }
}


//Obtener las tareas del proyecto

function obtenerTareasProyecto($id = null)
{
    include 'conexion.php';
    try {
        return $conn->query("SELECT id, nombre, estado FROM tareas WHERE id_proyecto = {$id}");
    } catch (Exception $e) {
        echo "Error! : " . $e->getMessage();
        return false;
    }
}

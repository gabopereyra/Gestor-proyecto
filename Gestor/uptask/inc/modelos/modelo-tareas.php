<?php

$accion = $_POST['accion'];


if ($accion === 'crear') {

    $id_proyecto = (int) $_POST['id_proyecto'];
    $tarea = $_POST['tarea'];

    // importar la conexion
    include '../funciones/conexion.php';

    try {
        //realizar consulta
        $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?, ?)");
        $stmt->bind_param('si', $tarea, $id_proyecto);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'tarea' => $tarea
            );
        } else {
            $respuesta = array(
                'respuesta' => "Error"
            );
        }

        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        //en caso de error, tomar la excepcion
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}

if ($accion === 'actualizar') {

    $estado = $_POST['estado'];
    $id_tarea = (int) $_POST['id'];
    // importar la conexion
    include '../funciones/conexion.php';

    try {
        //realizar consulta
        $stmt = $conn->prepare("UPDATE tareas set estado = ? where id = ?");
        $stmt->bind_param('ii', $estado, $id_tarea);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
            );
        } else {
            $respuesta = array(
                'respuesta' => "Error"
            );
        }

        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        //en caso de error, tomar la excepcion
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}

if ($accion === 'eliminar') {

    $id_tarea = (int) $_POST['id'];
    // importar la conexion
    include '../funciones/conexion.php';

    try {
        //realizar consulta
        $stmt = $conn->prepare("DELETE from tareas where id = ?");
        $stmt->bind_param('i', $id_tarea);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
            );
        } else {
            $respuesta = array(
                'respuesta' => "Error"
            );
        }

        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        //en caso de error, tomar la excepcion
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}

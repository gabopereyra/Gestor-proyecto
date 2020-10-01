<?php

function usuario_validado()
{
    if (!revisar_user()) {
        header('location:login.php');
        exit;
    }
}

function revisar_user()
{
    return isset($_SESSION['nombre']);
}

session_start(); //permite no tener que loguear constantemente
usuario_validado();

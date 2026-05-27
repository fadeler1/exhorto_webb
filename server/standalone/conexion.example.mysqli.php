<?php

/**
 * EJEMPLO: reemplaza el contenido de conexion.php en el hosting para eliminar
 * mysql_connect() (deprecated) y usar mysqli.
 *
 * 1) Copia tus host, usuario, contraseña y nombre de base desde el conexion.php actual.
 * 2) Sustituye la función Conectarse() por una versión como la de abajo (ajusta valores).
 * 3) Usa comillas SIMPLES para la contraseña si contiene $, :, etc.; en comillas dobles PHP
 *    interpreta $ como inicio de variable y la conexión puede fallar sin aviso claro.
 * 4) El resto del sitio que aún llame mysql_* debe migrarse por fases; estos endpoints
 *    (login_conexion.php, recuperar_conexion.php) ya usan exhortos_db_* vía db_bridge.php.
 *
 * Equivalente típico (hosting ctr17658 / base ctr17658_EXHORTO): rellena la contraseña real.
 */

function Conectarse()
{
    $host = 'localhost';
    $usuario = 'ctr17658';
    $password = 'PON_AQUI_TU_PASSWORD_ENTRE_COMILLAS_SIMPLES';
    $base = 'ctr17658_EXHORTO';

    $mysqli = @new mysqli($host, $usuario, $password, $base);
    if ($mysqli->connect_errno) {
        return false;
    }
    if (method_exists($mysqli, 'set_charset')) {
        $mysqli->set_charset('utf8');
    }
    return $mysqli;
}

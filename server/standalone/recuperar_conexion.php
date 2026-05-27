<?php

/**
 * Recuperación de contraseña (equivalente al script legacy con EMAIL + mail + AUTORIZACION).
 *
 * Ubicación: misma carpeta que login_conexion.php o ajusta $conexion_path.
 * React: POST JSON {"email":"..."} con Content-Type application/json
 *        o form POST campo EMAIL (legacy).
 *
 * .env en el front:
 *   VITE_AUTH_FORGOT_PATH=/api/recuperar_conexion.php
 *
 * No incluyas contraseñas de MySQL en este archivo: usa solo conexion.php.
 */

// ========================= CONFIGURA ============================
$cors_allow = array(
    'http://localhost:5173',
    'http://localhost:4173',
    'https://www.tramitadorexhorto.cl',
    'https://tramitadorexhorto.cl',
);

$conexion_path = __DIR__ . '/../conexion.php';

$tabla_usuario = 'USUARIO';
$col_email = 'EMAIL';
$col_autorizacion = 'AUTORIZACION';

/** Índice de fila (orden del SELECT *) para el nombre en el correo (tu script usaba $row[1]). */
$idx_nombre_correo = 1;

/** URL absoluta del cambio de contraseña (debe coincidir con cambioContrasena.php en el servidor). */
$base_url_cambio = 'https://www.tramitadorexhorto.cl/cambioContrasena.php';

$mail_from = 'Tramitador exhorto <no-reply@tramitadorexhorto.cl>';
$mail_reply_to = 'no-reply@tramitadorexhorto.cl';
$mail_subject = 'Recuperación de contraseña - Tramitador exhorto';

/** Mismo rango que el script original (considera ampliar por seguridad). */
$n_min = 0;
$n_max = 100000;
// ================================================================

if (!class_exists('mysqli') && !function_exists('mysql_query')) {
    header('Content-Type: application/json; charset=utf-8');
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(
        array('message' => 'No hay extensión de base de datos: se requiere mysqli (recomendado) o mysql (obsoleto).')
    );
    exit;
}

require_once __DIR__ . '/db_bridge.php';

function cors_apply_recuperar($cors_allow)
{
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    if ($origin !== '') {
        foreach ($cors_allow as $allowed) {
            if ($allowed === $origin) {
                header('Access-Control-Allow-Origin: ' . $origin);
                header('Vary: Origin');
                header('Access-Control-Allow-Credentials: true');
                break;
            }
        }
    }
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept, Authorization');
    header('Access-Control-Max-Age: 86400');
}

function json_resp_recuperar($payload, $code)
{
    if (function_exists('http_response_code')) {
        http_response_code($code);
    } else {
        $proto = isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.1';
        $map = array(
            200 => '200 OK',
            204 => '204 No Content',
            400 => '400 Bad Request',
            404 => '404 Not Found',
            405 => '405 Method Not Allowed',
            500 => '500 Internal Server Error',
        );
        $t = isset($map[$code]) ? $map[$code] : '500 Internal Server Error';
        header($proto . ' ' . $t);
    }
    if ($code === 204) {
        exit;
    }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload);
    exit;
}

function sql_ident_recuperar($name)
{
    if (!preg_match('/^[A-Za-z0-9_]+$/', $name)) {
        return null;
    }
    return '`' . str_replace('`', '``', $name) . '`';
}

cors_apply_recuperar($cors_allow);

$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';
if ($method === 'OPTIONS') {
    json_resp_recuperar(null, 204);
}

if ($method !== 'POST') {
    json_resp_recuperar(array('message' => 'Método no permitido.'), 405);
}

$email_raw = null;
$content_type = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
if (stripos($content_type, 'application/json') !== false) {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (is_array($data) && isset($data['email']) && is_string($data['email'])) {
        $email_raw = trim($data['email']);
    }
} else {
    if (isset($_POST['EMAIL']) && is_string($_POST['EMAIL'])) {
        $email_raw = trim($_POST['EMAIL']);
    }
}

if ($email_raw === null || $email_raw === '') {
    json_resp_recuperar(array('message' => 'Indica un correo electrónico.'), 400);
}

if (!is_file($conexion_path)) {
    json_resp_recuperar(array('message' => 'No se encuentra conexion.php.'), 500);
}

require_once $conexion_path;
if (!function_exists('Conectarse')) {
    json_resp_recuperar(array('message' => 'conexion.php no define Conectarse().'), 500);
}

$link = Conectarse();
if (!exhortos_db_link_ok($link)) {
    json_resp_recuperar(array('message' => 'No se pudo conectar a la base de datos.'), 500);
}

$email_esc = exhortos_db_escape($link, $email_raw);

$t = sql_ident_recuperar($tabla_usuario);
$ce = sql_ident_recuperar($col_email);
if ($t === null || $ce === null) {
    json_resp_recuperar(array('message' => 'Configuración de tabla/columna inválida.'), 500);
}

$query = 'SELECT * FROM ' . $t . ' WHERE ' . $ce . " = '" . $email_esc . "' LIMIT 1";
$result = exhortos_db_query($link, $query);
if ($result === false) {
    json_resp_recuperar(array('message' => 'Error al consultar la base de datos.'), 500);
}

$cantidad = exhortos_db_num_rows($result);
if ($cantidad < 1) {
    exhortos_db_free_result($result);
    json_resp_recuperar(
        array(
            'message' =>
                'No está registrado con ese email. Favor contactarse con el Administrador del sitio.',
        ),
        404
    );
}

$row = exhortos_db_fetch_row($result);
exhortos_db_free_result($result);

if (!is_array($row)) {
    json_resp_recuperar(
        array(
            'message' =>
                'No está registrado con ese email. Favor contactarse con el Administrador del sitio.',
        ),
        404
    );
}

$n = mt_rand($n_min, $n_max);
$n_int = (int) $n;

$ca = sql_ident_recuperar($col_autorizacion);
if ($ca === null) {
    json_resp_recuperar(array('message' => 'Columna AUTORIZACION inválida en configuración.'), 500);
}

$upd = 'UPDATE ' . $t . ' SET ' . $ca . ' = ' . $n_int . ' WHERE ' . $ce . " = '" . $email_esc . "' LIMIT 1";
$upd_result = exhortos_db_query($link, $upd);
if ($upd_result === false) {
    json_resp_recuperar(array('message' => 'No se pudo guardar el código de recuperación.'), 500);
}

$nombre = '';
if (isset($row[$idx_nombre_correo])) {
    $nombre = $row[$idx_nombre_correo];
}
$nombre_html = htmlspecialchars((string) $nombre, ENT_QUOTES, 'UTF-8');
$link_cambio = rtrim($base_url_cambio, '?') . '?aut=' . $n_int;

$email_message = '<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body>
<div bgcolor="#ededed">
<table border="0" cellspacing="0" bgcolor="#ededed" width="100%">
<tbody><tr><td>
<table border="0" cellpadding="0" cellspacing="0" align="center" width="600">
<tbody><tr><td bgcolor="#FFFFFF">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody>
<tr><td style="text-align:left;padding:10px 20px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#003366"><strong>Hola ' . $nombre_html . ',</strong></td></tr>
<tr><td style="text-align:left;padding:0 20px 10px 20px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#003366">
<p style="color:rgb(0,51,102);font-size:11px;text-align:justify">Para realizar el cambio de contraseña, presione el siguiente enlace.</p>
<p style="font-size:11px"><a href="' . htmlspecialchars($link_cambio, ENT_QUOTES, 'UTF-8') . '" style="color:rgb(0,81,255)" target="_blank">Presione aquí</a></p>
</td></tr>
</tbody></table>
</td></tr></tbody></table>
</td></tr></tbody></table>
</div>
</body></html>';

$encabezado = "MIME-Version: 1.0\r\n";
$encabezado .= "Content-type: text/html; charset=UTF-8\r\n";
$encabezado .= 'From: ' . $mail_from . "\r\n";
$encabezado .= 'Reply-To: ' . $mail_reply_to . "\r\n";

@mail($email_raw, $mail_subject, $email_message, $encabezado);

json_resp_recuperar(
    array(
        'success' => true,
        'message' =>
            'Correo registrado en la base de datos. Se enviará un mensaje con el enlace para cambiar la contraseña.',
    ),
    200
);

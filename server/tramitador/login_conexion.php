<?php

/**
 * Login compatible con conexion.php + mysql_* (PHP antiguo).
 *
 * COLOCA ESTE ARCHIVO EN EL MISMO DIRECTORIO QUE conexion.php (ej. public_html).
 * expone: POST JSON (React) o POST form como tu login actual (USUARIO / PASSWORD).
 *
 * React (.env):
 *   VITE_API_BASE_URL=https://www.tramitadorexhorto.cl
 *   VITE_AUTH_LOGIN_PATH=/login_conexion.php
 *
 * El fetch del front debe ir con credentials: 'include' (ya está en httpAuthService)
 * para que la cookie de sesión PHP exista en el mismo sitio.
 */

// ========================= AJUSTES MÍNIMOS =============================
// Orígenes exactos del front (incluye http/https y con/sin www si aplica)
$cors_allow = array(
    'http://localhost:5173',
    'http://localhost:4173',
    'https://www.tramitadorexhorto.cl',
    'https://tramitadorexhorto.cl',
);

// Archivo de conexión (misma carpeta que este script)
$conexion_path = __DIR__ . '/conexion.php';

// Misma tabla y columnas que tu consulta actual
$tabla_usuario = 'USUARIO';
$col_login = 'LOGIN';
$col_password = 'PASSWORD';

/**
 * mysql_fetch_row: índices según el orden de columnas en tu SELECT *.
 * Tu script original usaba $row[1] para $_SESSION["usuario"] y $row[4] para perfil.
 */
$idx_session_usuario = 1;
$idx_session_perfil = 4;

// Tiempo de sesión como en tu login legacy (segundos)
$session_lifetime_segundos = 7200;
// =======================================================================

if (!function_exists('mysql_query')) {
    header('Content-Type: application/json; charset=utf-8');
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(array('message' => 'La extensión mysql no está disponible en este servidor.'));
    exit;
}

function cors_apply($cors_allow)
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

function json_resp($payload, $code)
{
    if (function_exists('http_response_code')) {
        http_response_code($code);
    } else {
        $proto = isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.1';
        $texts = array(
            200 => '200 OK',
            204 => '204 No Content',
            400 => '400 Bad Request',
            401 => '401 Unauthorized',
            405 => '405 Method Not Allowed',
            500 => '500 Internal Server Error',
        );
        $text = isset($texts[$code]) ? $texts[$code] : '500 Internal Server Error';
        header($proto . ' ' . $text);
    }

    if ($code === 204) {
        exit;
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload);
    exit;
}

cors_apply($cors_allow);

$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';
if ($method === 'OPTIONS') {
    json_resp(null, 204);
}

if ($method !== 'POST') {
    json_resp(array('message' => 'Método no permitido.'), 405);
}

$usuario = null;
$password = null;

$content_type = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
if (stripos($content_type, 'application/json') !== false) {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_resp(array('message' => 'JSON inválido.'), 400);
    }
    if (isset($data['username']) && is_string($data['username'])) {
        $usuario = trim($data['username']);
    } elseif (isset($data['usuario']) && is_string($data['usuario'])) {
        $usuario = trim($data['usuario']);
    }
    if (isset($data['password']) && is_string($data['password'])) {
        $password = $data['password'];
    } elseif (isset($data['clave']) && is_string($data['clave'])) {
        $password = $data['clave'];
    }
} else {
    if (isset($_POST['USUARIO']) && is_string($_POST['USUARIO'])) {
        $usuario = trim($_POST['USUARIO']);
    }
    if (isset($_POST['PASSWORD']) && is_string($_POST['PASSWORD'])) {
        $password = $_POST['PASSWORD'];
    }
}

if ($usuario === null || $usuario === '' || $password === null) {
    json_resp(array('message' => 'Usuario y contraseña son obligatorios.'), 400);
}

if (!is_file($conexion_path)) {
    json_resp(array('message' => 'No se encuentra conexion.php. Revisa $conexion_path en login_conexion.php.'), 500);
}

require_once $conexion_path;

if (!function_exists('Conectarse')) {
    json_resp(array('message' => 'conexion.php no define Conectarse().'), 500);
}

$link = Conectarse();
if (!$link) {
    json_resp(array('message' => 'No se pudo conectar a la base de datos.'), 500);
}

$user_esc = mysql_real_escape_string($usuario, $link);
$pass_esc = mysql_real_escape_string($password, $link);

$tabla_s = preg_replace('/[^A-Za-z0-9_]/', '', $tabla_usuario);
if ($tabla_s === '') {
    json_resp(array('message' => 'Nombre de tabla inválido.'), 500);
}
$col_l = preg_replace('/[^A-Za-z0-9_]/', '', $col_login);
$col_p = preg_replace('/[^A-Za-z0-9_]/', '', $col_password);
if ($col_l === '' || $col_p === '') {
    json_resp(array('message' => 'Nombre de columna inválido.'), 500);
}

$query = "SELECT * FROM `" . $tabla_s . "` WHERE `" . $col_l . "` = '" . $user_esc . "' AND `" . $col_p . "` = '" . $pass_esc . "' LIMIT 1";

$result = mysql_query($query, $link);
if ($result === false) {
    json_resp(array('message' => 'Error al consultar la base de datos.'), 500);
}

$cantidad = mysql_num_rows($result);
if ($cantidad < 1) {
    json_resp(array('message' => 'Usuario o contraseña incorrectos.'), 401);
}

$row = mysql_fetch_row($result);
mysql_free_result($result);

if (!is_array($row)) {
    json_resp(array('message' => 'Usuario o contraseña incorrectos.'), 401);
}

if (!isset($row[$idx_session_usuario])) {
    json_resp(array('message' => 'Configuración: índice de usuario de sesión inválido.'), 500);
}

ini_set('session.cookie_lifetime', (string) $session_lifetime_segundos);
ini_set('session.gc_maxlifetime', (string) $session_lifetime_segundos);
session_start();

$_SESSION['usuario'] = $row[$idx_session_usuario];
if (isset($row[$idx_session_perfil])) {
    $_SESSION['perfil'] = $row[$idx_session_perfil];
}

session_regenerate_id(true);
$token = session_id();

$login_mostrar = $usuario;

json_resp(
    array(
        'token' => $token,
        'user' => array(
            'username' => (string) $login_mostrar,
            'nombre' => (string) $row[$idx_session_usuario],
            'perfil' => isset($row[$idx_session_perfil]) ? $row[$idx_session_perfil] : null,
        ),
    ),
    200
);

<?php

/**
 * Endpoint de login en UN SOLO archivo. Compatible PHP 5.5+ / mysqli / sin composer.
 *
 * PASOS:
 * 1) Sube este archivo como public_html/login_endpoint.php (o el nombre que quieras).
 * 2) Rellena la sección CONFIG con datos de tu base y tabla de usuarios.
 * 3) Ejecuta en MySQL una sola vez el CREATE TABLE más abajo (comentario al final).
 * 4) En React: VITE_AUTH_LOGIN_PATH=/login_endpoint.php
 *
 * IMPORTANTE:
 * - Si puedes subir PHP a 8.x en cPanel, hazlo (5.5 es muy antigua e insegura).
 */

// ========================= CONFIGURA AQUÍ ============================
$db_host = 'localhost';
$db_port = 3306;
$db_user = 'TU_USUARIO_MYSQL';
$db_pass = 'TU_PASSWORD_MYSQL';
$db_name = 'TU_BASE_DATOS';

// Tabla y columnas (ajusta a tu esquema real)
$user_table = 'usuarios';
$col_id = 'id';
$col_login = 'usuario';
$col_password = 'password';

// Orígenes CORS exactos donde corre el React (con/sin www)
$cors_allow = array(
    'http://localhost:5173',
    'http://localhost:4173',
    'https://www.tramitadorexhorto.cl',
    'https://tramitadorexhorto.cl',
);

/**
 * bcrypt | md5 | plain | auto
 * auto: intenta bcrypt, md5(hex 32 chars), texto plano
 */
$password_mode = 'auto';

// TTL del token guardado en api_tokens (horas)
$token_ttl_hours = 168;

// Charset conexión: utf8mb4 si tu MySQL lo soporta; si falla cambia a 'utf8'
$db_charset = 'utf8mb4';
// =====================================================================

if (!function_exists('hash_equals')) {
    function hash_equals($a, $b)
    {
        if (strlen($a) !== strlen($b)) {
            return false;
        }
        $r = 0;
        $len = strlen($a);
        for ($i = 0; $i < $len; $i++) {
            $r |= ord($a[$i]) ^ ord($b[$i]);
        }
        return $r === 0;
    }
}

function cors_send_headers($cors_allow)
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

function json_die($payload, $code)
{
    if (function_exists('http_response_code')) {
        http_response_code($code);
    } else {
        $proto = isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.1';
        if ($code === 200) {
            header($proto . ' 200 OK');
        } elseif ($code === 400) {
            header($proto . ' 400 Bad Request');
        } elseif ($code === 401) {
            header($proto . ' 401 Unauthorized');
        } elseif ($code === 405) {
            header($proto . ' 405 Method Not Allowed');
        } elseif ($code === 204) {
            header($proto . ' 204 No Content');
        } else {
            header($proto . ' 500 Internal Server Error');
        }
    }

    if ($code === 204) {
        exit;
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload);
    exit;
}

function sql_ident($name)
{
    if (!preg_match('/^[A-Za-z0-9_]+$/', $name)) {
        json_die(array('message' => 'Nombre de columna/tabla inválido en CONFIG.'), 500);
    }
    return '`' . str_replace('`', '``', $name) . '`';
}

function verify_password_store($plain, $stored, $mode)
{
    if ($mode === 'plain') {
        return hash_equals($stored, $plain);
    }
    if ($mode === 'md5') {
        return strtolower($stored) === md5($plain);
    }
    if ($mode === 'bcrypt') {
        return password_verify($plain, $stored);
    }
    if ($mode === 'auto') {
        $info = password_get_info($stored);
        if (isset($info['algo']) && $info['algo'] !== 0) {
            return password_verify($plain, $stored);
        }
        if (strlen($stored) === 32 && ctype_xdigit($stored)) {
            return strtolower($stored) === md5($plain);
        }
        return hash_equals($stored, $plain);
    }
    return false;
}

function random_token_hex($bytes)
{
    if (function_exists('openssl_random_pseudo_bytes')) {
        $strong = false;
        $raw = openssl_random_pseudo_bytes($bytes, $strong);
        if ($raw !== false) {
            return bin2hex($raw);
        }
    }
    $out = '';
    for ($i = 0; $i < $bytes * 2; $i++) {
        $out .= dechex(mt_rand(0, 15));
    }
    return $out;
}

cors_send_headers($cors_allow);

$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';
if ($method === 'OPTIONS') {
    json_die(null, 204);
}

header('Content-Type: application/json; charset=utf-8');

if ($method !== 'POST') {
    json_die(array('message' => 'Método no permitido.'), 405);
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    json_die(array('message' => 'JSON inválido.'), 400);
}

$username = null;
$password = null;
foreach (array('username', 'usuario', 'user', 'email') as $k) {
    if (isset($data[$k]) && is_string($data[$k]) && trim($data[$k]) !== '') {
        $username = trim($data[$k]);
        break;
    }
}
foreach (array('password', 'clave', 'pass') as $k) {
    if (isset($data[$k]) && is_string($data[$k])) {
        $password = $data[$k];
        break;
    }
}

if ($username === null || $password === null) {
    json_die(array('message' => 'Usuario y contraseña son obligatorios.'), 400);
}

$link = mysqli_init();
if ($link === false) {
    json_die(array('message' => 'Error interno (mysqli).'), 500);
}

if (!mysqli_real_connect($link, $db_host, $db_user, $db_pass, $db_name, (int) $db_port)) {
    json_die(array('message' => 'No se pudo conectar a la base de datos.'), 500);
}

if (!mysqli_set_charset($link, $db_charset)) {
    if ($db_charset === 'utf8mb4' && mysqli_set_charset($link, 'utf8')) {
        // ok fallback
    } else {
        json_die(array('message' => 'No se pudo fijar charset de la conexión.'), 500);
    }
}

$tUser = sql_ident($user_table);
$cId = sql_ident($col_id);
$cLogin = sql_ident($col_login);
$cPass = sql_ident($col_password);

$sql = 'SELECT ' . $cId . ', ' . $cLogin . ', ' . $cPass . ' FROM ' . $tUser . ' WHERE ' . $cLogin . ' = ? LIMIT 1';
$stmt = mysqli_prepare($link, $sql);
if ($stmt === false) {
    json_die(array('message' => 'Error al preparar consulta.'), 500);
}

mysqli_stmt_bind_param($stmt, 's', $username);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $uid, $ulogin, $upass);
$found = mysqli_stmt_fetch($stmt);
mysqli_stmt_close($stmt);

if (!$found) {
    json_die(array('message' => 'Usuario o contraseña incorrectos.'), 401);
}

if (!verify_password_store($password, $upass, $password_mode)) {
    json_die(array('message' => 'Usuario o contraseña incorrectos.'), 401);
}

$token = random_token_hex(32);
$ttl = (int) $token_ttl_hours;
if ($ttl < 1) {
    $ttl = 24;
}

$ins = mysqli_prepare(
    $link,
    'INSERT INTO api_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? HOUR))'
);
if ($ins === false) {
    json_die(
        array(
            'message' =>
                'No se pudo guardar el token. ¿Creaste la tabla api_tokens? (ver comentario al final de login_endpoint.php).',
        ),
        500
    );
}

mysqli_stmt_bind_param($ins, 'isi', $uid, $token, $ttl);
if (!mysqli_stmt_execute($ins)) {
    mysqli_stmt_close($ins);
    mysqli_close($link);
    json_die(
        array(
            'message' =>
                'Error al emitir token. Verifica la tabla api_tokens y permisos del usuario MySQL.',
        ),
        500
    );
}
mysqli_stmt_close($ins);
mysqli_close($link);

json_die(
    array(
        'token' => $token,
        'user' => array(
            'id' => (int) $uid,
            'username' => (string) $ulogin,
        ),
    ),
    200
);

/*
Ejecutar UNA VEZ en MySQL (phpMyAdmin):

CREATE TABLE IF NOT EXISTS api_tokens (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    token CHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_api_tokens_token (token),
    KEY idx_api_tokens_user_id (user_id),
    KEY idx_api_tokens_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

*/

<?php

/**
 * Login compatible con conexion.php + mysqli (recomendado) o mysql_* (legacy vía db_bridge.php).
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
 *
 * El campo "token" es un JWT firmado (HS256): tres partes separadas por puntos
 * (header.payload.signature), no un id corto opaco.
 */

/**
 * @param string $path
 * @return string
 */
function exhortos_read_jwt_secret_line($path)
{
    if (!is_file($path) || !is_readable($path)) {
        return '';
    }
    $raw = file_get_contents($path);
    if ($raw === false) {
        return '';
    }
    if (strncmp($raw, "\xEF\xBB\xBF", 3) === 0) {
        $raw = substr($raw, 3);
    }
    $lines = preg_split("/\r\n|\n|\r/", $raw);
    if (!is_array($lines)) {
        $one = trim($raw);
        return strlen($one) >= 32 ? $one : '';
    }
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '') {
            continue;
        }
        if (isset($line[0]) && $line[0] === '#') {
            continue;
        }
        return $line;
    }
    return '';
}

// ========================= AJUSTES MÍNIMOS =============================
// Orígenes exactos del front (incluye http/https y con/sin www si aplica)
$cors_allow = array(
    'http://localhost:5173',
    'http://localhost:4173',
    'https://www.tramitadorexhorto.cl',
    'https://tramitadorexhorto.cl',
);

// Archivo de conexión (misma carpeta que este script)
// Si login_conexion.php está en una subcarpeta y conexion.php está un nivel arriba:
$conexion_path = __DIR__ . '/../conexion.php';

// Clave para firmar el JWT (mínimo 32 caracteres).
// Opción A: pégala aquí entre comillas.
// Opción B: archivo login_jwt_secret.txt (misma carpeta que este script), una línea útil.
// Opción C (si el hosting lo permite): variable de entorno EXHORTOS_JWT_SECRET (≥32 caracteres).
$jwt_secret = '';
$jwt_secret_file = __DIR__ . '/login_jwt_secret.txt';

if (strlen($jwt_secret) < 32) {
    $fromEnv = getenv('EXHORTOS_JWT_SECRET');
    if ($fromEnv === false && isset($_SERVER['EXHORTOS_JWT_SECRET'])) {
        $fromEnv = $_SERVER['EXHORTOS_JWT_SECRET'];
    }
    if ($fromEnv !== false && is_string($fromEnv)) {
        $fromEnv = trim($fromEnv);
        if (strlen($fromEnv) >= 32) {
            $jwt_secret = $fromEnv;
        }
    }
}

if (strlen($jwt_secret) < 32) {
    $fromFile = exhortos_read_jwt_secret_line($jwt_secret_file);
    if (strlen($fromFile) >= 32) {
        $jwt_secret = $fromFile;
    }
}

/** Índice de columna con el ID de usuario para el claim "sub" (-1 si no existe / no usar). */
$idx_user_id_column = 0;

// Misma tabla y columnas que tu consulta actual
$tabla_usuario = 'USUARIO';
$col_login = 'LOGIN';
$col_password = 'PASSWORD';

/**
 * fetch_row: índices según el orden de columnas en tu SELECT *.
 * Tu script original usaba $row[1] para $_SESSION["usuario"] y $row[4] para perfil.
 */
$idx_session_usuario = 1;
$idx_session_perfil = 4;

// Tiempo de sesión como en tu login legacy (segundos)
$session_lifetime_segundos = 7200;
// =======================================================================

if (!class_exists('mysqli') && !function_exists('mysql_query')) {
    header('Content-Type: application/json; charset=utf-8');
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(
        array('message' => 'No hay extensión de base de datos: se requiere mysqli (recomendado) o mysql (obsoleto).')
    );
    exit;
}

require_once __DIR__ . '/db_bridge.php';

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

function jwt_base64url_encode($data)
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

/**
 * JWT HS256 sin dependencias (PHP 5.5+).
 * @param array $claims
 * @param string $secret
 * @return string|null
 */
function jwt_encode_hs256($claims, $secret)
{
    if ($secret === null || $secret === '') {
        return null;
    }

    $header = array('typ' => 'JWT', 'alg' => 'HS256');
    $flags = defined('JSON_UNESCAPED_UNICODE') ? JSON_UNESCAPED_UNICODE : 0;

    $header_json = json_encode($header);
    $payload_json = json_encode($claims, $flags);
    if ($header_json === false || $payload_json === false) {
        return null;
    }

    $a = jwt_base64url_encode($header_json);
    $b = jwt_base64url_encode($payload_json);
    $signing_input = $a . '.' . $b;

    $sig = hash_hmac('sha256', $signing_input, $secret, true);
    if ($sig === false) {
        return null;
    }

    return $signing_input . '.' . jwt_base64url_encode($sig);
}

cors_apply($cors_allow);

$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';
if ($method === 'OPTIONS') {
    json_resp(null, 204);
}

if ($method !== 'POST') {
    json_resp(array('message' => 'Método no permitido.'), 405);
}

if (strlen($jwt_secret) < 32) {
    $diag = array(
        'message' =>
            'Falta la clave JWT (mínimo 32 caracteres). El servidor no encontró $jwt_secret válido, ni EXHORTOS_JWT_SECRET, ni una línea suficientemente larga en el archivo .txt.',
        'hint' =>
            '1) En Mac: openssl rand -base64 48  2) Sube el archivo indicado en servidor_busca_txt con UNA sola línea (solo el texto, sin comillas). Si el archivo ya existe, revisa que la primera línea no sea un comentario # y tenga ≥32 caracteres.',
        'servidor_busca_txt' => $jwt_secret_file,
        'archivo_existe' => is_file($jwt_secret_file),
        'archivo_legible' => is_file($jwt_secret_file) && is_readable($jwt_secret_file),
    );
    $line = exhortos_read_jwt_secret_line($jwt_secret_file);
    $diag['longitud_clave_leida_del_txt'] = strlen($line);

    json_resp($diag, 500);
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
if (!exhortos_db_link_ok($link)) {
    json_resp(array('message' => 'No se pudo conectar a la base de datos.'), 500);
}

$user_esc = exhortos_db_escape($link, $usuario);
$pass_esc = exhortos_db_escape($link, $password);

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

$result = exhortos_db_query($link, $query);
if ($result === false) {
    json_resp(array('message' => 'Error al consultar la base de datos.'), 500);
}

$cantidad = exhortos_db_num_rows($result);
if ($cantidad < 1) {
    exhortos_db_free_result($result);
    json_resp(array('message' => 'Usuario o contraseña incorrectos.'), 401);
}

$row = exhortos_db_fetch_row($result);
exhortos_db_free_result($result);

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

$login_mostrar = $usuario;
$nombre_mostrar = (string) $row[$idx_session_usuario];
$perfil_mostrar = isset($row[$idx_session_perfil]) ? $row[$idx_session_perfil] : null;

$now = time();
$exp = $now + (int) $session_lifetime_segundos;

$jwt_claims = array(
    'iat' => $now,
    'exp' => $exp,
    'username' => (string) $login_mostrar,
    'nombre' => $nombre_mostrar,
    'perfil' => $perfil_mostrar,
);

if ($idx_user_id_column >= 0 && isset($row[$idx_user_id_column])) {
    $jwt_claims['sub'] = (string) $row[$idx_user_id_column];
}

$token = jwt_encode_hs256($jwt_claims, $jwt_secret);
if ($token === null || $token === '') {
    json_resp(array('message' => 'Error al generar el JWT.'), 500);
}

json_resp(
    array(
        'token' => $token,
        'user' => array(
            'username' => (string) $login_mostrar,
            'nombre' => $nombre_mostrar,
            'perfil' => $perfil_mostrar,
        ),
    ),
    200
);

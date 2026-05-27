<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/includes/bootstrap.php';

$corsOrigins = $config['cors_allowed_origins'] ?? [];
if (!is_array($corsOrigins)) {
    $corsOrigins = [];
}

/** @var list<string> $corsOrigins */
Cors::apply($corsOrigins);
Cors::handlePreflight();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Método no permitido.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$raw = file_get_contents('php://input') ?: '';
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['message' => 'JSON inválido.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$username = null;
$password = null;

foreach (['username', 'usuario', 'user', 'email'] as $key) {
    if (isset($data[$key]) && is_string($data[$key]) && $data[$key] !== '') {
        $username = trim($data[$key]);
        break;
    }
}

foreach (['password', 'clave', 'pass'] as $key) {
    if (isset($data[$key]) && is_string($data[$key])) {
        $password = $data[$key];
        break;
    }
}

if ($username === null || $username === '' || $password === null) {
    http_response_code(400);
    echo json_encode(['message' => 'Usuario y contraseña son obligatorios.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $dbConfig = $config['database'] ?? [];
    if (!is_array($dbConfig)) {
        throw new RuntimeException('Configuración de base de datos inválida.');
    }

    $mysqli = Database::connection($dbConfig);

    $usersTable = (string) ($config['users_table'] ?? 'usuarios');
    $idCol = (string) ($config['user_id_column'] ?? 'id');
    $loginCol = (string) ($config['user_login_column'] ?? 'usuario');
    $passwordCol = (string) ($config['user_password_column'] ?? 'password');
    $passwordMode = (string) ($config['password_mode'] ?? 'auto');

    $users = new UserRepository($mysqli, $usersTable, $idCol, $loginCol, $passwordCol);
    $user = $users->findByLogin($username);

    if ($user === null) {
        http_response_code(401);
        echo json_encode(['message' => 'Usuario o contraseña incorrectos.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $verifier = new PasswordVerifier($passwordMode);
    if (!$verifier->verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['message' => 'Usuario o contraseña incorrectos.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $ttl = (int) ($config['token_ttl_hours'] ?? 168);
    if ($ttl < 1) {
        $ttl = 24;
    }

    $tokens = new TokenService($mysqli);
    $token = $tokens->issue($user['id'], $ttl);

    http_response_code(200);
    echo json_encode(
        [
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'username' => $user['login'],
            ],
        ],
        JSON_UNESCAPED_UNICODE,
    );
} catch (Throwable $e) {
    $isDev = (($config['environment'] ?? '') === 'development');
    http_response_code(500);
    echo json_encode(
        [
            'message' => 'Error interno del servidor.',
            'detail' => $isDev ? $e->getMessage() : null,
        ],
        JSON_UNESCAPED_UNICODE,
    );
}

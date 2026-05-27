<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$configPath = dirname(__DIR__) . '/config/config.php';
if (!is_file($configPath)) {
    http_response_code(500);
    echo json_encode([
        'message' => 'Falta config.php. Copia config.example.php a config.php y completa los datos.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/** @var array<string,mixed> $config */
$config = require $configPath;

if (!empty($config['timezone']) && is_string($config['timezone'])) {
    date_default_timezone_set($config['timezone']);
}

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Cors.php';
require_once __DIR__ . '/PasswordVerifier.php';
require_once __DIR__ . '/UserRepository.php';
require_once __DIR__ . '/TokenService.php';

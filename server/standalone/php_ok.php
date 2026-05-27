<?php

/**
 * Prueba sin .htaccess: sube SOLO este archivo a public_html (o a una subcarpeta).
 * Compatible con PHP 5.5+ del hosting antiguo (sin operador ?? de PHP 7).
 *
 * Si sigue HTTP 500: en cPanel elige PHP 8.x si existe (Seleccionador multiphp),
 * revisa los logs de error_log, o revisa sintaxis desde terminal: php -l php_ok.php
 *
 * IMPORTANTE: elimínalo después de verificar el despliegue.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$docRoot = isset($_SERVER['DOCUMENT_ROOT']) ? $_SERVER['DOCUMENT_ROOT'] : null;
$scriptName = isset($_SERVER['SCRIPT_NAME']) ? $_SERVER['SCRIPT_NAME'] : null;

$payload = array(
    'ok' => true,
    'message' => 'PHP se ejecutó correctamente en este servidor.',
    'timestamp' => date('c'),
    'php_version' => PHP_VERSION,
    'document_root' => $docRoot,
    'script_name' => $scriptName,
);

echo json_encode(
    $payload,
    JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
);

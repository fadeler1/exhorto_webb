<?php

/**
 * Prueba sin .htaccess: sube SOLO este archivo a public_html (o a una subcarpeta).
 * Ábrelo en el navegador: https://tudominio.cl/php_ok.php
 * Debes ver JSON con ok: true. Si ves código PHP en texto plano, el servidor no ejecuta PHP.
 *
 * IMPORTANTE: elimínalo después de verificar el despliegue (información sensible del entorno).
 */

header('Content-Type: application/json; charset=utf-8');

// CORS permisivo solo para demos; ajústalo en producción.
header('Access-Control-Allow-Origin: *');

echo json_encode(
    [
        'ok' => true,
        'message' => 'PHP se ejecutó correctamente en este servidor.',
        'timestamp' => date('c'),
        'php_version' => PHP_VERSION,
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? null,
        'script_name' => $_SERVER['SCRIPT_NAME'] ?? null,
    ],
    JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT,
);

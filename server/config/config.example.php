<?php

declare(strict_types=1);

/**
 * Copia este archivo a config.php en el mismo directorio y completa los valores.
 * config.php no debe subirse a git si contiene secretos (está en .gitignore del repo).
 */
return [
    'environment' => 'production',

    'database' => [
        'host' => 'localhost',
        'port' => 3306,
        'name' => 'nombre_base_datos',
        'user' => 'usuario_mysql',
        'password' => 'password_mysql',
        'charset' => 'utf8mb4',
    ],

    /**
     * Tabla de usuarios existente.
     * Ajusta nombres de columnas según tu esquema MySQL.
     */
    'users_table' => 'usuarios',
    'user_id_column' => 'id',
    'user_login_column' => 'usuario',
    'user_password_column' => 'password',

    /**
     * Cómo validar la contraseña almacenada:
     * - bcrypt: password_hash / password_verify (recomendado)
     * - md5: contraseña guardada como MD5 en hex minúsculas (legado)
     * - plain: comparación directa (solo transición; migrar cuanto antes)
     * - auto: intenta bcrypt, luego md5 hex, luego texto plano
     */
    'password_mode' => 'auto',

    /** Orígenes permitidos para CORS (URLs del front React, sin barra final). */
    'cors_allowed_origins' => [
        'http://localhost:5173',
        'https://tramitadorexhorto.cl',
    ],

    /** Horas de vida del token devuelto al front. */
    'token_ttl_hours' => 168,

    /** Zona horaria de la app (opcional). */
    'timezone' => 'America/Santiago',
];

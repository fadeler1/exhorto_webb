<?php

declare(strict_types=1);

final class Database
{
    private static ?mysqli $connection = null;

    public static function connection(array $dbConfig): mysqli
    {
        if (self::$connection instanceof mysqli) {
            return self::$connection;
        }

        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

        $port = isset($dbConfig['port']) ? (int) $dbConfig['port'] : 3306;
        $charset = $dbConfig['charset'] ?? 'utf8mb4';

        $mysqli = new mysqli(
            $dbConfig['host'],
            $dbConfig['user'],
            $dbConfig['password'],
            $dbConfig['name'],
            $port,
        );

        $mysqli->set_charset($charset);
        self::$connection = $mysqli;

        return self::$connection;
    }
}

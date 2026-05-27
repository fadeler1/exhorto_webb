<?php

/**
 * Puente entre mysql_* (obsoleto) y mysqli para scripts que incluyen conexion.php.
 * Conectarse() puede devolver un recurso mysql (legacy) o una instancia mysqli.
 */

if (!function_exists('exhortos_db_link_ok')) {
    /**
     * @param mixed $link
     * @return bool
     */
    function exhortos_db_link_ok($link)
    {
        if ($link === false || $link === null) {
            return false;
        }
        if ($link instanceof mysqli) {
            return $link->connect_errno === 0;
        }
        return true;
    }

    /**
     * @param mixed $link
     * @param string $str
     * @return string
     */
    function exhortos_db_escape($link, $str)
    {
        if ($link instanceof mysqli) {
            return mysqli_real_escape_string($link, (string) $str);
        }
        if (function_exists('mysql_real_escape_string')) {
            return mysql_real_escape_string((string) $str, $link);
        }
        return '';
    }

    /**
     * @param mixed $link
     * @param string $sql
     * @return mysqli_result|resource|bool
     */
    function exhortos_db_query($link, $sql)
    {
        if ($link instanceof mysqli) {
            return mysqli_query($link, $sql);
        }
        if (function_exists('mysql_query')) {
            return mysql_query($sql, $link);
        }
        return false;
    }

    /**
     * @param mysqli_result|resource $result
     * @return int
     */
    function exhortos_db_num_rows($result)
    {
        if ($result instanceof mysqli_result) {
            return (int) mysqli_num_rows($result);
        }
        if (function_exists('mysql_num_rows')) {
            return (int) mysql_num_rows($result);
        }
        return 0;
    }

    /**
     * @param mysqli_result|resource $result
     * @return array|null|false
     */
    function exhortos_db_fetch_row($result)
    {
        if ($result instanceof mysqli_result) {
            return mysqli_fetch_row($result);
        }
        if (function_exists('mysql_fetch_row')) {
            return mysql_fetch_row($result);
        }
        return false;
    }

    /**
     * @param mysqli_result|resource $result
     * @return void
     */
    function exhortos_db_free_result($result)
    {
        if ($result instanceof mysqli_result) {
            mysqli_free_result($result);
            return;
        }
        if (function_exists('mysql_free_result')) {
            mysql_free_result($result);
        }
    }
}

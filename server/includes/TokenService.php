<?php

declare(strict_types=1);

final class TokenService
{
    public function __construct(private mysqli $db)
    {
    }

    /**
     * Genera y guarda un token opaco para el usuario.
     */
    public function issue(int $userId, int $ttlHours): string
    {
        $token = bin2hex(random_bytes(32));
        $stmt = $this->db->prepare(
            'INSERT INTO api_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? HOUR))',
        );

        if ($stmt === false) {
            throw new RuntimeException('No se pudo preparar la inserción del token.');
        }

        $stmt->bind_param('isi', $userId, $token, $ttlHours);
        $stmt->execute();
        $stmt->close();

        return $token;
    }
}

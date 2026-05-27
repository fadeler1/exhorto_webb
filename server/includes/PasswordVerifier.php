<?php

declare(strict_types=1);

final class PasswordVerifier
{
    public function __construct(private string $mode)
    {
    }

    public function verify(string $plain, string $stored): bool
    {
        return match ($this->mode) {
            'bcrypt' => $this->verifyBcrypt($plain, $stored),
            'md5' => $this->verifyMd5Hex($plain, $stored),
            'plain' => hash_equals($stored, $plain),
            'auto' => $this->verifyAuto($plain, $stored),
            default => $this->verifyAuto($plain, $stored),
        };
    }

    private function verifyAuto(string $plain, string $stored): bool
    {
        $info = password_get_info($stored);
        if (($info['algo'] ?? null) !== null) {
            return password_verify($plain, $stored);
        }

        if (strlen($stored) === 32 && ctype_xdigit($stored)) {
            return hash_equals(strtolower($stored), md5($plain));
        }

        return hash_equals($stored, $plain);
    }

    private function verifyBcrypt(string $plain, string $stored): bool
    {
        return password_verify($plain, $stored);
    }

    private function verifyMd5Hex(string $plain, string $stored): bool
    {
        return hash_equals(strtolower($stored), md5($plain));
    }
}

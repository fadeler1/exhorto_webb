<?php

declare(strict_types=1);

final class UserRepository
{
    public function __construct(
        private mysqli $db,
        private string $table,
        private string $idCol,
        private string $loginCol,
        private string $passwordCol,
    ) {
    }

    /**
     * @return array{id:int,login:string,password:string}|null
     */
    public function findByLogin(string $login): ?array
    {
        $table = $this->quoteIdentifier($this->table);
        $loginCol = $this->quoteIdentifier($this->loginCol);
        $idCol = $this->quoteIdentifier($this->idCol);
        $passCol = $this->quoteIdentifier($this->passwordCol);

        $sql = "SELECT {$idCol} AS id, {$loginCol} AS login, {$passCol} AS password FROM {$table} WHERE {$loginCol} = ? LIMIT 1";
        $stmt = $this->db->prepare($sql);
        if ($stmt === false) {
            throw new RuntimeException('No se pudo preparar la consulta de usuario.');
        }

        $stmt->bind_param('s', $login);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result?->fetch_assoc();
        $stmt->close();

        if (!is_array($row)) {
            return null;
        }

        $id = isset($row['id']) ? (int) $row['id'] : 0;
        $loginValue = isset($row['login']) ? (string) $row['login'] : '';
        $passwordValue = isset($row['password']) ? (string) $row['password'] : '';

        if ($id <= 0 || $loginValue === '') {
            return null;
        }

        return [
            'id' => $id,
            'login' => $loginValue,
            'password' => $passwordValue,
        ];
    }

    private function quoteIdentifier(string $name): string
    {
        $clean = preg_replace('/[^A-Za-z0-9_]/', '', $name) ?? '';
        if ($clean === '' || $clean !== $name) {
            throw new InvalidArgumentException('Nombre de identificador SQL inválido.');
        }

        return '`' . str_replace('`', '``', $clean) . '`';
    }
}

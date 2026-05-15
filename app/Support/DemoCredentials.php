<?php

namespace App\Support;

use App\Enums\UserRole;

final class DemoCredentials
{
    public const PASSWORD = 'password';

    /**
     * @return list<array{role: string, label: string, name: string, email: string, password: string}>
     */
    public static function accounts(): array
    {
        return [
            [
                'role' => UserRole::Admin->value,
                'label' => UserRole::Admin->label(),
                'name' => 'Administrator Sistem',
                'email' => 'admin@lapcm.test',
                'password' => self::PASSWORD,
            ],
            [
                'role' => UserRole::Approver->value,
                'label' => UserRole::Approver->label(),
                'name' => 'Budi Santoso',
                'email' => 'approver@lapcm.test',
                'password' => self::PASSWORD,
            ],
            [
                'role' => UserRole::Pemohon->value,
                'label' => UserRole::Pemohon->label().' 1',
                'name' => 'Siti Rahayu',
                'email' => 'pemohon1@lapcm.test',
                'password' => self::PASSWORD,
            ],
            [
                'role' => UserRole::Pemohon->value,
                'label' => UserRole::Pemohon->label().' 2',
                'name' => 'Ahmad Wijaya',
                'email' => 'pemohon2@lapcm.test',
                'password' => self::PASSWORD,
            ],
        ];
    }
}

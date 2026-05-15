<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Approver = 'approver';
    case Pemohon = 'pemohon';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrator',
            self::Approver => 'Penyetuju',
            self::Pemohon => 'Pemohon',
        };
    }
}

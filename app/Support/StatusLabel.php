<?php

namespace App\Support;

final class StatusLabel
{
    /**
     * @return array<string, string>
     */
    public static function pengajuan(): array
    {
        return [
            'draft' => 'Draft',
            'diajukan' => 'Diajukan',
            'diproses' => 'Diproses',
            'disetujui' => 'Disetujui',
            'ditolak' => 'Ditolak',
            'selesai' => 'Selesai',
            'dibatalkan' => 'Dibatalkan',
        ];
    }

    public static function pengajuanLabel(string $status): string
    {
        return self::pengajuan()[$status] ?? ucfirst(str_replace('_', ' ', $status));
    }

    /**
     * @return array<string, string>
     */
    public static function sarana(): array
    {
        return [
            'tersedia' => 'Tersedia',
            'maintenance' => 'Maintenance',
            'tidak_aktif' => 'Tidak Aktif',
        ];
    }

    public static function saranaLabel(string $status): string
    {
        return self::sarana()[$status] ?? ucfirst(str_replace('_', ' ', $status));
    }
}

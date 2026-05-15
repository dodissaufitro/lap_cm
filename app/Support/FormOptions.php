<?php

namespace App\Support;

final class FormOptions
{
    /**
     * @param  array<string, string>  $map
     * @return list<array{value: string, label: string}>
     */
    public static function fromMap(array $map): array
    {
        return collect($map)
            ->map(fn (string $label, string $value) => ['value' => $value, 'label' => $label])
            ->values()
            ->all();
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function pengajuanStatus(): array
    {
        return self::fromMap(StatusLabel::pengajuan());
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function saranaStatus(): array
    {
        return self::fromMap(StatusLabel::sarana());
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function approvalStatus(): array
    {
        return self::fromMap([
            'pending' => 'Menunggu',
            'disetujui' => 'Disetujui',
            'ditolak' => 'Ditolak',
            'revisi' => 'Revisi',
        ]);
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function jadwalStatus(): array
    {
        return self::fromMap([
            'aktif' => 'Aktif',
            'selesai' => 'Selesai',
            'dibatalkan' => 'Dibatalkan',
        ]);
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function userRoles(): array
    {
        return collect(\App\Enums\UserRole::cases())
            ->map(fn (\App\Enums\UserRole $role) => [
                'value' => $role->value,
                'label' => $role->label(),
            ])
            ->all();
    }
}

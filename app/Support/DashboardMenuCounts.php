<?php

namespace App\Support;

use App\Enums\UserRole;
use App\Models\ApprovalPengajuan;
use App\Models\JadwalPenggunaan;
use App\Models\KategoriSarana;
use App\Models\Lampiran;
use App\Models\LogAktivitas;
use App\Models\Pengajuan;
use App\Models\Sarana;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class DashboardMenuCounts
{
    /**
     * @return array<string, array{total: int, label: string}>
     */
    public static function forUser(User $user): array
    {
        return [
            '/dashboard' => [
                'total' => self::pengajuanCount($user),
                'label' => $user->role === UserRole::Pemohon ? 'pengajuan saya' : 'pengajuan',
            ],
            '/pengajuans' => [
                'total' => self::pengajuanCount($user),
                'label' => $user->role === UserRole::Pemohon ? 'pengajuan' : 'data',
            ],
            '/approval-pengajuans' => [
                'total' => self::approvalCount($user),
                'label' => 'persetujuan',
            ],
            '/saranas' => [
                'total' => Sarana::query()->count(),
                'label' => 'sarana',
            ],
            '/kategori-saranas' => [
                'total' => KategoriSarana::query()->count(),
                'label' => 'kategori',
            ],
            '/jadwal-penggunaans' => [
                'total' => self::jadwalCount($user),
                'label' => 'jadwal',
            ],
            '/lampirans' => [
                'total' => self::lampiranCount($user),
                'label' => 'berkas',
            ],
            '/users' => [
                'total' => User::query()->count(),
                'label' => 'pengguna',
            ],
            '/log-aktivitas' => [
                'total' => LogAktivitas::query()->count(),
                'label' => 'log',
            ],
        ];
    }

    private static function pengajuanCount(User $user): int
    {
        return self::scopePengajuan(Pengajuan::query(), $user)->count();
    }

    /**
     * @param  Builder<Pengajuan>  $query
     * @return Builder<Pengajuan>
     */
    private static function scopePengajuan(Builder $query, User $user): Builder
    {
        if ($user->role === UserRole::Pemohon) {
            $query->where('user_id', $user->id);
        }

        return $query;
    }

    private static function approvalCount(User $user): int
    {
        $query = ApprovalPengajuan::query();

        if ($user->role === UserRole::Approver) {
            $query->where('approver_id', $user->id);
        }

        return $query->count();
    }

    private static function jadwalCount(User $user): int
    {
        $query = JadwalPenggunaan::query();

        if ($user->role === UserRole::Pemohon) {
            $query->whereHas('pengajuan', fn (Builder $q) => $q->where('user_id', $user->id));
        }

        return $query->count();
    }

    private static function lampiranCount(User $user): int
    {
        $query = Lampiran::query();

        if ($user->role === UserRole::Pemohon) {
            $query->whereHas('pengajuan', fn (Builder $q) => $q->where('user_id', $user->id));
        }

        return $query->count();
    }
}

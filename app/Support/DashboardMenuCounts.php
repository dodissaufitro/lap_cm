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
            '/proses' => [
                'total' => self::prosesPendingCount($user),
                'label' => 'proses aktif',
            ],
            '/proses/check-in' => [
                'total' => self::checkInCount($user),
                'label' => 'menunggu check in',
            ],
            '/proses/check-out' => [
                'total' => self::checkOutCount($user),
                'label' => 'menunggu check out',
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
        return Pengajuan::query()->visibleTo($user)->count();
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

    private static function prosesPendingCount(User $user): int
    {
        return self::checkInCount($user) + self::checkOutCount($user);
    }

    private static function checkInCount(User $user): int
    {
        PengajuanProsesService::cancelExpiredWithoutCheckIn();

        return Pengajuan::query()
            ->visibleTo($user)
            ->where('status', 'disetujui')
            ->whereNull('checked_out_at')
            ->count();
    }

    private static function checkOutCount(User $user): int
    {
        return Pengajuan::query()
            ->visibleTo($user)
            ->where('status', 'disetujui')
            ->whereNotNull('checked_in_at')
            ->whereNull('checked_out_at')
            ->count();
    }
}

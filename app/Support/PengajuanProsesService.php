<?php

namespace App\Support;

use App\Models\JadwalPenggunaan;
use App\Models\Pengajuan;
use Illuminate\Support\Carbon;

final class PengajuanProsesService
{
    /**
     * Batalkan pengajuan disetujui yang melewati hari acara tanpa check in.
     */
    public static function cancelExpiredWithoutCheckIn(): int
    {
        $cancelled = 0;

        Pengajuan::query()
            ->where('status', 'disetujui')
            ->whereNull('checked_in_at')
            ->whereDate('tanggal_selesai', '<', self::today()->toDateString())
            ->orderBy('id')
            ->each(function (Pengajuan $pengajuan) use (&$cancelled): void {
                $pengajuan->update(['status' => 'dibatalkan']);

                ActivityLogger::log(
                    "Pengajuan {$pengajuan->nomor_pengajuan} dibatalkan otomatis (tidak check in pada hari acara)",
                    $pengajuan,
                );

                $cancelled++;
            });

        return $cancelled;
    }

    /**
     * Check in aktif jika hari, bulan, dan tahun hari ini sama dengan tanggal_mulai.
     */
    public static function isOnEventDay(Pengajuan $pengajuan): bool
    {
        return self::calendarDate($pengajuan->tanggal_mulai)
            ->isSameDay(self::today());
    }

    public static function performCheckIn(Pengajuan $pengajuan): string
    {
        PengajuanTicketBarcode::ensureToken($pengajuan);

        $pengajuan->update(['checked_in_at' => now()]);

        $path = PengajuanCheckInDocument::generate($pengajuan->fresh());

        $pengajuan->update(['check_in_dokumen_path' => $path]);

        ActivityLogger::log(
            "Check in pengajuan {$pengajuan->nomor_pengajuan}, dokumen bukti dibuat",
            $pengajuan,
        );

        return $path;
    }

    public static function performCheckOut(Pengajuan $pengajuan): void
    {
        $pengajuan->update([
            'checked_out_at' => now(),
            'status' => 'selesai',
        ]);

        JadwalPenggunaan::query()
            ->where('pengajuan_id', $pengajuan->id)
            ->update(['status' => 'selesai']);

        ActivityLogger::log(
            "Check out pengajuan {$pengajuan->nomor_pengajuan}, status diubah menjadi selesai",
            $pengajuan,
        );
    }

    public static function checkInStatusLabel(Pengajuan $pengajuan): string
    {
        if ($pengajuan->checked_in_at) {
            return 'Sudah check in';
        }

        if (self::isOnEventDay($pengajuan)) {
            return 'Siap check in';
        }

        $startDate = self::calendarDate($pengajuan->tanggal_mulai)->toDateString();
        $today = self::today()->toDateString();

        if ($startDate > $today) {
            return 'Menunggu hari acara';
        }

        if (self::calendarDate($pengajuan->tanggal_selesai)->toDateString() >= $today) {
            return 'Lewat hari check in';
        }

        return 'Lewat hari acara';
    }

    private static function today(): Carbon
    {
        return Carbon::today(self::timezone());
    }

    private static function calendarDate(Carbon|string $value): Carbon
    {
        return Carbon::parse($value, self::timezone())->startOfDay();
    }

    private static function timezone(): string
    {
        return (string) config('app.timezone', 'UTC');
    }
}

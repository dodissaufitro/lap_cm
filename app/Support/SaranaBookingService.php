<?php

namespace App\Support;

use App\Models\Pengajuan;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class SaranaBookingService
{
    /** @var list<string> */
    public const BLOCKING_STATUSES = ['diproses', 'disetujui'];

    /**
     * @return list<int>
     */
    public function bookedSaranaIds(
        CarbonInterface $mulai,
        CarbonInterface $selesai,
        ?int $exceptPengajuanId = null,
    ): array {
        return Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
            ->whereIn('status', self::BLOCKING_STATUSES)
            ->when($exceptPengajuanId, fn ($q) => $q->whereKeyNot($exceptPengajuanId))
            ->where('tanggal_mulai', '<', $selesai)
            ->where('tanggal_selesai', '>', $mulai)
            ->pluck('sarana_id')
            ->unique()
            ->map(fn ($id) => (int) $id)
            ->values()
            ->all();
    }

    public function isBooked(
        int $saranaId,
        CarbonInterface $mulai,
        CarbonInterface $selesai,
        ?int $exceptPengajuanId = null,
    ): bool {
        return in_array($saranaId, $this->bookedSaranaIds($mulai, $selesai, $exceptPengajuanId), true);
    }

    /**
     * @param  Collection<int, object{id: int, nama_sarana: string, kode_sarana: string}>|list<object{id: int, nama_sarana: string, kode_sarana: string}>  $saranas
     * @return list<array{id: int, nama_sarana: string, kode_sarana: string, is_booked: bool}>
     */
    public function availabilityPayload(
        Collection|array $saranas,
        CarbonInterface $mulai,
        CarbonInterface $selesai,
        ?int $exceptPengajuanId = null,
    ): array {
        $bookedIds = $this->bookedSaranaIds($mulai, $selesai, $exceptPengajuanId);

        return collect($saranas)
            ->map(fn ($sarana) => [
                'id' => (int) $sarana->id,
                'nama_sarana' => $sarana->nama_sarana,
                'kode_sarana' => $sarana->kode_sarana,
                'is_booked' => in_array((int) $sarana->id, $bookedIds, true),
            ])
            ->values()
            ->all();
    }

    /**
     * @throws ValidationException
     */
    public function assertAvailable(
        int $saranaId,
        CarbonInterface $mulai,
        CarbonInterface $selesai,
        ?int $exceptPengajuanId = null,
    ): void {
        if ($this->isBooked($saranaId, $mulai, $selesai, $exceptPengajuanId)) {
            throw ValidationException::withMessages([
                'sarana_id' => 'Sarana sudah di booking pada rentang waktu yang dipilih.',
            ]);
        }
    }
}

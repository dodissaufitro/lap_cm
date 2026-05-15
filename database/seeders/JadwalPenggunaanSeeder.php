<?php

namespace Database\Seeders;

use App\Models\JadwalPenggunaan;
use App\Models\Pengajuan;
use Illuminate\Database\Seeder;

class JadwalPenggunaanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Pengajuan::query()
            ->whereIn('status', ['disetujui', 'selesai'])
            ->each(function (Pengajuan $pengajuan): void {
                JadwalPenggunaan::query()->updateOrCreate(
                    ['pengajuan_id' => $pengajuan->id],
                    [
                        'sarana_id' => $pengajuan->sarana_id,
                        'mulai' => $pengajuan->tanggal_mulai,
                        'selesai' => $pengajuan->tanggal_selesai,
                        'status' => $pengajuan->status === 'selesai' ? 'selesai' : 'aktif',
                    ],
                );
            });
    }
}

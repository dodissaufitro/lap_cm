<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Pengajuan;
use App\Models\Sarana;
use App\Models\User;
use Database\Seeders\Support\SeederCounts;
use Illuminate\Database\Seeder;

class PengajuanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pemohons = User::query()->where('role', UserRole::Pemohon)->pluck('id');
        $saranaIds = Sarana::query()->pluck('id');

        if ($pemohons->isEmpty() || $saranaIds->isEmpty()) {
            return;
        }

        $pemohon1 = User::query()->where('email', 'pemohon1@lapcm.test')->first();
        $pemohon2 = User::query()->where('email', 'pemohon2@lapcm.test')->first();

        $aula = Sarana::query()->where('kode_sarana', 'RS-001')->first();
        $lapangan = Sarana::query()->where('kode_sarana', 'OL-001')->first();
        $mobil = Sarana::query()->where('kode_sarana', 'KN-001')->first();
        $rapat = Sarana::query()->where('kode_sarana', 'RS-002')->first();

        if ($pemohon1 && $aula && $lapangan && $mobil) {
            $pengajuans = [
                [
                    'user_id' => $pemohon1->id,
                    'sarana_id' => $aula->id,
                    'nomor_pengajuan' => 'PNG-2026-0001',
                    'tanggal_pengajuan' => now()->toDateString(),
                    'tanggal_mulai' => now()->addDays(3)->setTime(8, 0),
                    'tanggal_selesai' => now()->addDays(3)->setTime(14, 0),
                    'tujuan_penggunaan' => 'Rapat koordinasi program kerja triwulan',
                    'jumlah_peserta' => 80,
                    'status' => 'disetujui',
                ],
                [
                    'user_id' => $pemohon2?->id ?? $pemohon1->id,
                    'sarana_id' => $lapangan->id,
                    'nomor_pengajuan' => 'PNG-2026-0002',
                    'tanggal_pengajuan' => now()->toDateString(),
                    'tanggal_mulai' => now()->addDays(5)->setTime(15, 0),
                    'tanggal_selesai' => now()->addDays(5)->setTime(18, 0),
                    'tujuan_penggunaan' => 'Turnamen basket antar unit kerja',
                    'jumlah_peserta' => 40,
                    'status' => 'diproses',
                ],
                [
                    'user_id' => $pemohon1->id,
                    'sarana_id' => $mobil->id,
                    'nomor_pengajuan' => 'PNG-2026-0003',
                    'tanggal_pengajuan' => now()->subDay()->toDateString(),
                    'tanggal_mulai' => now()->addDays(2)->setTime(7, 0),
                    'tanggal_selesai' => now()->addDays(2)->setTime(17, 0),
                    'tujuan_penggunaan' => 'Kunjungan lapangan ke kantor cabang',
                    'jumlah_peserta' => 5,
                    'status' => 'ditolak',
                    'catatan_admin' => 'Jadwal kendaraan bentrok dengan kegiatan lain.',
                ],
                [
                    'user_id' => $pemohon2?->id ?? $pemohon1->id,
                    'sarana_id' => $rapat?->id ?? $aula->id,
                    'nomor_pengajuan' => 'PNG-2026-0004',
                    'tanggal_pengajuan' => now()->subDays(2)->toDateString(),
                    'tanggal_mulai' => now()->addDays(7)->setTime(9, 0),
                    'tanggal_selesai' => now()->addDays(7)->setTime(11, 0),
                    'tujuan_penggunaan' => 'Presentasi proposal kegiatan sosial',
                    'jumlah_peserta' => 15,
                    'status' => 'diajukan',
                ],
                [
                    'user_id' => $pemohon1->id,
                    'sarana_id' => $aula->id,
                    'nomor_pengajuan' => 'PNG-2026-0005',
                    'tanggal_pengajuan' => now()->subDays(5)->toDateString(),
                    'tanggal_mulai' => now()->subDays(3)->setTime(8, 0),
                    'tanggal_selesai' => now()->subDays(3)->setTime(12, 0),
                    'tujuan_penggunaan' => 'Pelatihan internal pegawai',
                    'jumlah_peserta' => 60,
                    'status' => 'selesai',
                ],
            ];

            foreach ($pengajuans as $pengajuan) {
                Pengajuan::query()->updateOrCreate(
                    ['nomor_pengajuan' => $pengajuan['nomor_pengajuan']],
                    $pengajuan,
                );
            }
        }

        $statuses = ['draft', 'diajukan', 'diproses', 'disetujui', 'ditolak', 'selesai', 'dibatalkan'];
        $tujuanSamples = [
            'Workshop peningkatan kapasitas SDM',
            'Rapat evaluasi program tahunan',
            'Pelatihan teknis bidang administrasi',
            'Kegiatan sosialisasi layanan publik',
            'Seminar kesehatan dan keselamatan kerja',
            'Koordinasi lintas unit kerja',
            'Studi banding fasilitas layanan',
            'Launching program inovasi daerah',
        ];

        $nextNumber = max(
            6,
            Pengajuan::query()->count() + 1,
        );

        $existingCount = Pengajuan::query()->count();

        for ($i = $existingCount; $i < SeederCounts::MIN_RECORDS; $i++) {
            $daysOffset = fake()->numberBetween(-60, 45);
            $tanggalPengajuan = now()->addDays($daysOffset)->startOfDay();
            $tanggalMulai = $tanggalPengajuan->copy()->addDays(fake()->numberBetween(1, 14))->setTime(fake()->numberBetween(7, 16), 0);
            $tanggalSelesai = $tanggalMulai->copy()->addHours(fake()->numberBetween(2, 8));

            Pengajuan::query()->create([
                'user_id' => $pemohons->random(),
                'sarana_id' => $saranaIds->random(),
                'nomor_pengajuan' => sprintf('PNG-2026-%04d', $nextNumber),
                'tanggal_pengajuan' => $tanggalPengajuan->toDateString(),
                'tanggal_mulai' => $tanggalMulai,
                'tanggal_selesai' => $tanggalSelesai,
                'tujuan_penggunaan' => fake()->randomElement($tujuanSamples).' '.fake()->words(2, true),
                'jumlah_peserta' => fake()->numberBetween(8, 120),
                'status' => fake()->randomElement($statuses),
                'catatan_admin' => fake()->optional(0.2)->sentence(),
            ]);

            $nextNumber++;
        }
    }
}

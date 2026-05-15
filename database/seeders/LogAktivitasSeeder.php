<?php

namespace Database\Seeders;

use App\Models\LogAktivitas;
use App\Models\Pengajuan;
use App\Models\Sarana;
use App\Models\User;
use Database\Seeders\Support\SeederCounts;
use Illuminate\Database\Seeder;

class LogAktivitasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::query()->where('email', 'admin@lapcm.test')->first();
        $approver = User::query()->where('email', 'approver@lapcm.test')->first();
        $pemohon1 = User::query()->where('email', 'pemohon1@lapcm.test')->first();

        $logs = [
            [
                'user_id' => $approver?->id,
                'aktivitas' => 'Pengajuan Aula Serbaguna (PNG-2026-0001) disetujui',
                'tabel' => 'pengajuans',
                'data_id' => 1,
                'created_at' => now()->subMinutes(5),
            ],
            [
                'user_id' => $approver?->id,
                'aktivitas' => 'Pengajuan Mobil Operasional (PNG-2026-0003) ditolak',
                'tabel' => 'pengajuans',
                'data_id' => 3,
                'created_at' => now()->subMinutes(20),
            ],
            [
                'user_id' => $admin?->id,
                'aktivitas' => 'Sarana baru "Lapangan Futsal" ditambahkan ke sistem',
                'tabel' => 'saranas',
                'data_id' => 4,
                'created_at' => now()->subHour(),
            ],
            [
                'user_id' => $pemohon1?->id,
                'aktivitas' => 'Pengajuan baru PNG-2026-0001 diajukan',
                'tabel' => 'pengajuans',
                'data_id' => 1,
                'created_at' => now()->subHours(3),
            ],
            [
                'user_id' => $pemohon1?->id,
                'aktivitas' => 'Pengajuan PNG-2026-0003 diajukan',
                'tabel' => 'pengajuans',
                'data_id' => 3,
                'created_at' => now()->subDay(),
            ],
            [
                'user_id' => $admin?->id,
                'aktivitas' => 'Status sarana Lapangan Futsal diubah menjadi maintenance',
                'tabel' => 'saranas',
                'data_id' => 4,
                'created_at' => now()->subDays(2),
            ],
        ];

        foreach ($logs as $log) {
            LogAktivitas::query()->updateOrCreate(
                [
                    'aktivitas' => $log['aktivitas'],
                    'user_id' => $log['user_id'],
                ],
                $log,
            );
        }

        $userIds = User::query()->pluck('id');
        $pengajuanSamples = Pengajuan::query()->inRandomOrder()->limit(15)->get(['id', 'nomor_pengajuan']);
        $saranaSamples = Sarana::query()->inRandomOrder()->limit(10)->get(['id', 'nama_sarana']);

        $existingCount = LogAktivitas::query()->count();

        for ($i = $existingCount; $i < SeederCounts::MIN_RECORDS; $i++) {
            $usePengajuan = fake()->boolean(65) && $pengajuanSamples->isNotEmpty();

            if ($usePengajuan) {
                $pengajuan = $pengajuanSamples->random();
                $aktivitas = fake()->randomElement([
                    fn () => "Pengajuan {$pengajuan->nomor_pengajuan} diperbarui",
                    fn () => "Pengajuan {$pengajuan->nomor_pengajuan} diajukan ke sistem",
                    fn () => "Status pengajuan {$pengajuan->nomor_pengajuan} berubah",
                ])();
                $tabel = 'pengajuans';
                $dataId = $pengajuan->id;
            } elseif ($saranaSamples->isNotEmpty()) {
                $sarana = $saranaSamples->random();
                $aktivitas = fake()->randomElement([
                    "Data sarana {$sarana->nama_sarana} diubah",
                    "Sarana {$sarana->nama_sarana} ditambahkan",
                    "Status sarana {$sarana->nama_sarana} diperbarui",
                ]);
                $tabel = 'saranas';
                $dataId = $sarana->id;
            } else {
                $aktivitas = fake()->sentence(6);
                $tabel = 'users';
                $dataId = $userIds->random();
            }

            LogAktivitas::query()->create([
                'user_id' => $userIds->random(),
                'aktivitas' => $aktivitas,
                'tabel' => $tabel,
                'data_id' => $dataId,
                'created_at' => fake()->dateTimeBetween('-90 days', 'now'),
            ]);
        }
    }
}

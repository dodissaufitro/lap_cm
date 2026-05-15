<?php

namespace Database\Seeders;

use App\Models\Lampiran;
use App\Models\Pengajuan;
use Database\Seeders\Support\SeederCounts;
use Illuminate\Database\Seeder;

class LampiranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pengajuanIds = Pengajuan::query()->pluck('id');

        if ($pengajuanIds->isEmpty()) {
            return;
        }

        $fileTypes = [
            ['surat_permohonan', 'application/pdf'],
            ['proposal_kegiatan', 'application/pdf'],
            ['rundown_acara', 'application/pdf'],
            ['daftar_peserta', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
            ['lampiran_gambar', 'image/jpeg'],
        ];

        $existingCount = Lampiran::query()->count();

        for ($i = $existingCount; $i < SeederCounts::MIN_RECORDS; $i++) {
            [$baseName, $mime] = fake()->randomElement($fileTypes);
            $namaFile = $baseName.'_'.str_pad((string) ($i + 1), 3, '0', STR_PAD_LEFT).'.'.(str_contains($mime, 'pdf') ? 'pdf' : (str_contains($mime, 'sheet') ? 'xlsx' : 'jpg'));

            Lampiran::query()->create([
                'pengajuan_id' => $pengajuanIds->random(),
                'nama_file' => $namaFile,
                'path_file' => 'lampiran/demo/'.$namaFile,
                'tipe_file' => $mime,
                'ukuran_file' => fake()->numberBetween(80_000, 3_000_000),
            ]);
        }
    }
}

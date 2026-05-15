<?php

namespace Database\Factories;

use App\Models\Lampiran;
use App\Models\Pengajuan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Lampiran>
 */
class LampiranFactory extends Factory
{
    protected $model = Lampiran::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $namaFile = fake()->randomElement(['surat_permohonan', 'proposal', 'rundown', 'daftar_hadir']).'_'.fake()->numerify('###').'.pdf';

        return [
            'pengajuan_id' => Pengajuan::factory(),
            'nama_file' => $namaFile,
            'path_file' => 'lampiran/demo/'.$namaFile,
            'tipe_file' => 'application/pdf',
            'ukuran_file' => fake()->numberBetween(50_000, 2_500_000),
        ];
    }
}

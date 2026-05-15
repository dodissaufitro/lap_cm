<?php

namespace Database\Seeders;

use App\Models\KategoriSarana;
use Illuminate\Database\Seeder;

class KategoriSaranaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kategoris = [
            [
                'nama_kategori' => 'Ruang Pertemuan',
                'deskripsi' => 'Aula, ruang rapat, dan ruang serbaguna',
            ],
            [
                'nama_kategori' => 'Olahraga',
                'deskripsi' => 'Lapangan dan fasilitas olahraga',
            ],
            [
                'nama_kategori' => 'Kendaraan',
                'deskripsi' => 'Mobil dan kendaraan operasional dinas',
            ],
            [
                'nama_kategori' => 'Peralatan',
                'deskripsi' => 'Proyektor, sound system, dan peralatan pendukung',
            ],
        ];

        foreach ($kategoris as $kategori) {
            KategoriSarana::query()->updateOrCreate(
                ['nama_kategori' => $kategori['nama_kategori']],
                $kategori,
            );
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\KategoriSarana;
use App\Models\Sarana;
use Database\Seeders\Support\SeederCounts;
use Illuminate\Database\Seeder;

class SaranaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ruang = KategoriSarana::query()->where('nama_kategori', 'Ruang Pertemuan')->first();
        $olahraga = KategoriSarana::query()->where('nama_kategori', 'Olahraga')->first();
        $kendaraan = KategoriSarana::query()->where('nama_kategori', 'Kendaraan')->first();
        $peralatan = KategoriSarana::query()->where('nama_kategori', 'Peralatan')->first();

        $saranas = [
            [
                'kategori_sarana_id' => $ruang?->id,
                'nama_sarana' => 'Aula Serbaguna',
                'kode_sarana' => 'RS-001',
                'lokasi' => 'Gedung A Lantai 2',
                'kapasitas' => 200,
                'fasilitas' => 'Sound system, proyektor, AC',
                'status' => 'tersedia',
            ],
            [
                'kategori_sarana_id' => $ruang?->id,
                'nama_sarana' => 'Ruang Rapat Utama',
                'kode_sarana' => 'RS-002',
                'lokasi' => 'Gedung B Lantai 1',
                'kapasitas' => 40,
                'fasilitas' => 'Meja rapat, layar LED',
                'status' => 'tersedia',
            ],
            [
                'kategori_sarana_id' => $olahraga?->id,
                'nama_sarana' => 'Lapangan Basket',
                'kode_sarana' => 'OL-001',
                'lokasi' => 'Area Timur Kompleks',
                'kapasitas' => 50,
                'fasilitas' => 'Ring basket, tribun kecil',
                'status' => 'tersedia',
            ],
            [
                'kategori_sarana_id' => $olahraga?->id,
                'nama_sarana' => 'Lapangan Futsal',
                'kode_sarana' => 'OL-002',
                'lokasi' => 'Area Selatan Kompleks',
                'kapasitas' => 30,
                'fasilitas' => 'Rumput sintetis, lampu sorot',
                'status' => 'maintenance',
            ],
            [
                'kategori_sarana_id' => $kendaraan?->id,
                'nama_sarana' => 'Mobil Operasional',
                'kode_sarana' => 'KN-001',
                'lokasi' => 'Pool Kendaraan',
                'kapasitas' => 7,
                'fasilitas' => 'BBM, sopir opsional',
                'status' => 'tersedia',
            ],
            [
                'kategori_sarana_id' => $kendaraan?->id,
                'nama_sarana' => 'Minibus Dinas',
                'kode_sarana' => 'KN-002',
                'lokasi' => 'Pool Kendaraan',
                'kapasitas' => 14,
                'fasilitas' => 'AC, kursi penumpang',
                'status' => 'tidak_aktif',
            ],
            [
                'kategori_sarana_id' => $peralatan?->id,
                'nama_sarana' => 'Paket Sound System',
                'kode_sarana' => 'PR-001',
                'lokasi' => 'Gudang Peralatan',
                'kapasitas' => null,
                'fasilitas' => 'Speaker, mixer, mikrofon',
                'status' => 'tersedia',
            ],
        ];

        foreach ($saranas as $sarana) {
            if ($sarana['kategori_sarana_id'] === null) {
                continue;
            }

            Sarana::query()->updateOrCreate(
                ['kode_sarana' => $sarana['kode_sarana']],
                $sarana,
            );
        }

        $kategoriIds = KategoriSarana::query()->pluck('id');

        if ($kategoriIds->isEmpty()) {
            return;
        }

        $namaSamples = [
            'Ruang Meeting',
            'Ruang Diskusi',
            'Laboratorium',
            'Studio Rekaman',
            'Lapangan Voli',
            'Lapangan Tenis',
            'Truk Operasional',
            'Sepeda Motor Dinas',
            'Set Proyektor',
            'Set Kursi Portable',
        ];

        $existingCount = Sarana::query()->count();
        $sequence = $existingCount + 1;

        for ($i = $existingCount; $i < SeederCounts::MIN_RECORDS; $i++) {
            $kode = sprintf('SN-%03d', $sequence);

            Sarana::query()->create([
                'kategori_sarana_id' => $kategoriIds->random(),
                'nama_sarana' => fake()->randomElement($namaSamples).' '.$sequence,
                'kode_sarana' => $kode,
                'lokasi' => fake()->randomElement([
                    'Gedung A Lantai 1',
                    'Gedung A Lantai 3',
                    'Gedung C',
                    'Area Barat Kompleks',
                    'Area Utara Kompleks',
                ]),
                'kapasitas' => fake()->numberBetween(15, 180),
                'fasilitas' => fake()->sentence(3),
                'status' => fake()->randomElement(['tersedia', 'maintenance', 'tidak_aktif']),
            ]);

            $sequence++;
        }
    }
}

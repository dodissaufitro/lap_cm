<?php

namespace Database\Factories;

use App\Models\KategoriSarana;
use App\Models\Sarana;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Sarana>
 */
class SaranaFactory extends Factory
{
    protected $model = Sarana::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kategori_sarana_id' => KategoriSarana::factory(),
            'nama_sarana' => fake()->words(3, true),
            'kode_sarana' => strtoupper(fake()->unique()->bothify('??-###')),
            'lokasi' => fake()->randomElement([
                'Gedung A Lantai 1',
                'Gedung A Lantai 2',
                'Gedung B Lantai 1',
                'Area Timur Kompleks',
                'Area Selatan Kompleks',
                'Pool Kendaraan',
                'Gudang Peralatan',
            ]),
            'kapasitas' => fake()->optional(0.85)->numberBetween(10, 250),
            'fasilitas' => fake()->optional(0.9)->sentence(4),
            'status' => fake()->randomElement(['tersedia', 'maintenance', 'tidak_aktif']),
            'keterangan' => fake()->optional(0.3)->sentence(),
        ];
    }
}

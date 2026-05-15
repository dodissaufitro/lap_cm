<?php

namespace Database\Factories;

use App\Models\JadwalPenggunaan;
use App\Models\Pengajuan;
use App\Models\Sarana;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JadwalPenggunaan>
 */
class JadwalPenggunaanFactory extends Factory
{
    protected $model = JadwalPenggunaan::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $mulai = fake()->dateTimeBetween('-14 days', '+45 days');
        $selesai = (clone $mulai)->modify('+'.fake()->numberBetween(2, 6).' hours');

        return [
            'sarana_id' => Sarana::factory(),
            'pengajuan_id' => Pengajuan::factory(),
            'mulai' => $mulai,
            'selesai' => $selesai,
            'status' => fake()->randomElement(['aktif', 'selesai', 'dibatalkan']),
        ];
    }
}

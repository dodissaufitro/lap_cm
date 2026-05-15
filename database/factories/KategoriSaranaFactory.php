<?php

namespace Database\Factories;

use App\Models\KategoriSarana;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<KategoriSarana>
 */
class KategoriSaranaFactory extends Factory
{
    protected $model = KategoriSarana::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_kategori' => fake()->unique()->words(2, true),
            'deskripsi' => fake()->sentence(),
        ];
    }
}

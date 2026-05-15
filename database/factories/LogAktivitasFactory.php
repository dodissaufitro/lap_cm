<?php

namespace Database\Factories;

use App\Models\LogAktivitas;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LogAktivitas>
 */
class LogAktivitasFactory extends Factory
{
    protected $model = LogAktivitas::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tabel = fake()->randomElement(['pengajuans', 'saranas', 'users', 'approval_pengajuans', 'jadwal_penggunaans']);

        return [
            'user_id' => User::query()->inRandomOrder()->value('id'),
            'aktivitas' => fake()->sentence(8),
            'tabel' => $tabel,
            'data_id' => fake()->numberBetween(1, 50),
            'created_at' => fake()->dateTimeBetween('-60 days', 'now'),
        ];
    }
}

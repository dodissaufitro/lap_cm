<?php

namespace Database\Factories;

use App\Models\ApprovalPengajuan;
use App\Models\Pengajuan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ApprovalPengajuan>
 */
class ApprovalPengajuanFactory extends Factory
{
    protected $model = ApprovalPengajuan::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = fake()->randomElement(['pending', 'disetujui', 'ditolak', 'revisi']);

        return [
            'pengajuan_id' => Pengajuan::factory(),
            'approver_id' => User::factory(),
            'level_approval' => 1,
            'status' => $status,
            'catatan' => fake()->optional(0.5)->sentence(),
            'approved_at' => in_array($status, ['disetujui', 'ditolak'], true)
                ? fake()->dateTimeBetween('-30 days', 'now')
                : null,
        ];
    }
}

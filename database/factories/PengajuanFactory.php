<?php

namespace Database\Factories;

use App\Models\Pengajuan;
use App\Models\Sarana;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pengajuan>
 */
class PengajuanFactory extends Factory
{
    protected $model = Pengajuan::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tanggalPengajuan = fake()->dateTimeBetween('-90 days', 'now');
        $tanggalMulai = fake()->dateTimeBetween($tanggalPengajuan, '+60 days');
        $tanggalSelesai = (clone $tanggalMulai)->modify('+'.fake()->numberBetween(2, 8).' hours');

        return [
            'user_id' => User::factory(),
            'sarana_id' => Sarana::factory(),
            'nomor_pengajuan' => 'PNG-'.fake()->unique()->numerify('####-####'),
            'tanggal_pengajuan' => $tanggalPengajuan,
            'tanggal_mulai' => $tanggalMulai,
            'tanggal_selesai' => $tanggalSelesai,
            'tujuan_penggunaan' => fake()->sentence(6),
            'jumlah_peserta' => fake()->optional(0.8)->numberBetween(5, 150),
            'status' => fake()->randomElement([
                'draft',
                'diajukan',
                'diproses',
                'disetujui',
                'ditolak',
                'selesai',
                'dibatalkan',
            ]),
            'catatan_admin' => fake()->optional(0.25)->sentence(),
        ];
    }
}

<?php

namespace Database\Seeders;

use App\Models\ApprovalPengajuan;
use App\Models\Pengajuan;
use App\Models\User;
use Illuminate\Database\Seeder;

class ApprovalPengajuanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $approver = User::query()->where('email', 'approver@lapcm.test')->first();

        if (! $approver) {
            return;
        }

        $statusMap = [
            'disetujui' => 'disetujui',
            'diproses' => 'pending',
            'ditolak' => 'ditolak',
            'diajukan' => 'pending',
            'selesai' => 'disetujui',
        ];

        Pengajuan::query()
            ->whereIn('status', array_keys($statusMap))
            ->each(function (Pengajuan $pengajuan) use ($approver, $statusMap): void {
                $approvalStatus = $statusMap[$pengajuan->status] ?? 'pending';
                $isFinal = in_array($approvalStatus, ['disetujui', 'ditolak'], true);

                ApprovalPengajuan::query()->updateOrCreate(
                    [
                        'pengajuan_id' => $pengajuan->id,
                        'approver_id' => $approver->id,
                        'level_approval' => 1,
                    ],
                    [
                        'status' => $approvalStatus,
                        'catatan' => $isFinal ? fake()->optional(0.6)->sentence() : null,
                        'approved_at' => $isFinal ? fake()->dateTimeBetween('-30 days', 'now') : null,
                    ],
                );
            });
    }
}

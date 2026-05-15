<?php

namespace App\Console\Commands;

use App\Support\PengajuanProsesService;
use Illuminate\Console\Command;

class CancelMissedPengajuanCheckInCommand extends Command
{
    protected $signature = 'pengajuan:cancel-missed-check-in';

    protected $description = 'Batalkan pengajuan disetujui yang melewati hari acara tanpa check in';

    public function handle(): int
    {
        $count = PengajuanProsesService::cancelExpiredWithoutCheckIn();

        $this->info("{$count} pengajuan dibatalkan.");

        return self::SUCCESS;
    }
}

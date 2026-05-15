<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            KategoriSaranaSeeder::class,
            SaranaSeeder::class,
            PengajuanSeeder::class,
            ApprovalPengajuanSeeder::class,
            JadwalPenggunaanSeeder::class,
            LampiranSeeder::class,
            LogAktivitasSeeder::class,
        ]);
    }
}

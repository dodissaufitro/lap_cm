<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jadwal_penggunaans', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sarana_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('pengajuan_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->dateTime('mulai');
            $table->dateTime('selesai');

            $table->enum('status', [
                'aktif',
                'selesai',
                'dibatalkan'
            ])->default('aktif');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal_penggunaans');
    }
};

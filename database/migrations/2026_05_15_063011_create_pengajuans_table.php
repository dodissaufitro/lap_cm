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
        Schema::create('pengajuans', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('sarana_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('nomor_pengajuan')->unique();

            $table->date('tanggal_pengajuan');

            $table->dateTime('tanggal_mulai');
            $table->dateTime('tanggal_selesai');

            $table->text('tujuan_penggunaan');

            $table->integer('jumlah_peserta')->nullable();

            $table->enum('status', [
                'draft',
                'diajukan',
                'diproses',
                'disetujui',
                'ditolak',
                'selesai',
                'dibatalkan'
            ])->default('draft');

            $table->text('catatan_admin')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengajuans');
    }
};

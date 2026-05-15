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
        Schema::create('saranas', function (Blueprint $table) {
            $table->id();

            $table->foreignId('kategori_sarana_id')
                ->constrained('kategori_saranas')
                ->cascadeOnDelete();

            $table->string('nama_sarana');
            $table->string('kode_sarana')->unique();

            $table->text('lokasi')->nullable();

            $table->integer('kapasitas')->nullable();

            $table->text('fasilitas')->nullable();

            $table->enum('status', [
                'tersedia',
                'maintenance',
                'tidak_aktif'
            ])->default('tersedia');

            $table->string('foto')->nullable();

            $table->text('keterangan')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saranas');
    }
};

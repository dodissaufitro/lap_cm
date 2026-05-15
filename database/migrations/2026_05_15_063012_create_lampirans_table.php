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
        Schema::create('lampirans', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pengajuan_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('nama_file');

            $table->string('path_file');

            $table->string('tipe_file')->nullable();

            $table->bigInteger('ukuran_file')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lampirans');
    }
};

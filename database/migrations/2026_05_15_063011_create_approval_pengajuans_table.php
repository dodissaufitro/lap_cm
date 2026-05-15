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
        Schema::create('approval_pengajuans', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pengajuan_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('approver_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->integer('level_approval')->default(1);

            $table->enum('status', [
                'pending',
                'disetujui',
                'ditolak',
                'revisi'
            ])->default('pending');

            $table->text('catatan')->nullable();

            $table->timestamp('approved_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approval_pengajuans');
    }
};

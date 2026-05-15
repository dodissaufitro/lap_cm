<?php

use App\Models\RoleMenuPermission;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pengajuans', function (Blueprint $table) {
            $table->dateTime('checked_in_at')->nullable()->after('catatan_admin');
            $table->dateTime('checked_out_at')->nullable()->after('checked_in_at');
        });

        foreach (['admin', 'pemohon'] as $role) {
            RoleMenuPermission::query()->updateOrCreate(
                ['role' => $role, 'menu_key' => 'proses'],
                ['allowed' => true],
            );
        }
    }

    public function down(): void
    {
        Schema::table('pengajuans', function (Blueprint $table) {
            $table->dropColumn(['checked_in_at', 'checked_out_at']);
        });

        RoleMenuPermission::query()->where('menu_key', 'proses')->delete();
    }
};

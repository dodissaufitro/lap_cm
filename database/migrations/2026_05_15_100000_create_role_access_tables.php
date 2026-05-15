<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('role_login_settings', function (Blueprint $table) {
            $table->string('role')->primary();
            $table->boolean('can_login')->default(true);
            $table->timestamps();
        });

        Schema::create('role_menu_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('role');
            $table->string('menu_key');
            $table->boolean('allowed')->default(false);
            $table->timestamps();

            $table->unique(['role', 'menu_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('role_menu_permissions');
        Schema::dropIfExists('role_login_settings');
    }
};

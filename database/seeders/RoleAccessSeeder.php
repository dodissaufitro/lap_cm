<?php

namespace Database\Seeders;

use App\Support\MenuPermissionService;
use Illuminate\Database\Seeder;

class RoleAccessSeeder extends Seeder
{
    public function run(): void
    {
        MenuPermissionService::seedDefaults();
    }
}

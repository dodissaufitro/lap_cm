<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use App\Support\DemoCredentials;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (DemoCredentials::accounts() as $account) {
            User::query()->updateOrCreate(
                ['email' => $account['email']],
                [
                    'name' => $account['name'],
                    'password' => Hash::make($account['password']),
                    'role' => UserRole::from($account['role']),
                    'is_active' => true,
                    'email_verified_at' => now(),
                ],
            );
        }
    }
}

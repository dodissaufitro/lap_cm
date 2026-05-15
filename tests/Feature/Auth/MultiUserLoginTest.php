<?php

namespace Tests\Feature\Auth;

use App\Enums\UserRole;
use App\Models\User;
use App\Support\DemoCredentials;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MultiUserLoginTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(UserSeeder::class);
    }

    public function test_login_page_lists_demo_users_in_local_environment(): void
    {
        $response = $this->get('/login');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('auth/login')
            ->has('demoUsers', 4)
            ->where('demoUsers.0.email', 'admin@lapcm.test')
        );
    }

    public function test_each_demo_role_can_authenticate(): void
    {
        foreach (DemoCredentials::accounts() as $account) {
            $response = $this->post('/login', [
                'email' => $account['email'],
                'password' => $account['password'],
            ]);

            $response->assertRedirect(route('dashboard', absolute: false));
            $this->assertAuthenticatedAs(
                User::query()->where('email', $account['email'])->first()
            );

            $this->post('/logout');
            $this->assertGuest();
        }
    }

    public function test_inactive_user_cannot_login(): void
    {
        $user = User::query()->where('email', 'pemohon1@lapcm.test')->first();
        $user->update(['is_active' => false]);

        $this->post('/login', [
            'email' => $user->email,
            'password' => DemoCredentials::PASSWORD,
        ])->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_registered_users_default_to_pemohon_role(): void
    {
        $response = $this->post('/register', [
            'name' => 'Pengguna Baru',
            'email' => 'baru@lapcm.test',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertRedirect(route('dashboard', absolute: false));

        $this->assertDatabaseHas('users', [
            'email' => 'baru@lapcm.test',
            'role' => UserRole::Pemohon->value,
            'is_active' => true,
        ]);
    }
}

<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_guests_are_redirected_to_the_login_page(): void
    {
        $this->get('/dashboard')->assertRedirect('/login');
    }

    public function test_authenticated_users_can_visit_the_dashboard(): void
    {
        $user = User::query()->where('email', 'admin@lapcm.test')->first();

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('dashboard')
                ->has('menuCounts')
                ->has('stats', 4)
                ->has('recentPengajuans')
                ->has('saranaByStatus', 3)
                ->has('recentActivities')
            );
    }

    public function test_pemohon_dashboard_shows_own_scope_stats(): void
    {
        $user = User::query()->where('email', 'pemohon1@lapcm.test')->first();

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('stats.0.title', 'Pengajuan Saya')
            );
    }
}

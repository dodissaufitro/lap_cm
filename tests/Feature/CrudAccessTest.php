<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CrudAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_admin_can_access_crud_index_pages(): void
    {
        $admin = User::query()->where('email', 'admin@lapcm.test')->first();

        $routes = [
            'kategori-saranas.index',
            'saranas.index',
            'pengajuans.index',
            'approval-pengajuans.index',
            'jadwal-penggunaans.index',
            'lampirans.index',
            'log-aktivitas.index',
            'users.index',
        ];

        foreach ($routes as $route) {
            $this->actingAs($admin)->get(route($route))->assertOk();
        }
    }

    public function test_pemohon_can_access_own_pengajuan_pages(): void
    {
        $pemohon = User::query()->where('email', 'pemohon1@lapcm.test')->first();

        $this->actingAs($pemohon)->get(route('pengajuans.index'))->assertOk();
        $this->actingAs($pemohon)->get(route('pengajuans.create'))->assertOk();
        $this->actingAs($pemohon)->get(route('kategori-saranas.index'))->assertForbidden();
    }
}

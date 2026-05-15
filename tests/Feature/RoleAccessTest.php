<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use App\Support\MenuPermissionService;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_admin_can_view_and_update_role_access_page(): void
    {
        $admin = User::query()->where('email', 'admin@lapcm.test')->first();

        $this->actingAs($admin)
            ->get(route('hak-akses.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('hak-akses/index')
                ->has('menus')
                ->has('roles')
                ->has('permissions')
                ->has('loginAccess'));

        $permissions = MenuPermissionService::permissionMatrix();
        $permissions['pemohon'] = collect(MenuPermissionService::menuDefinitions())
            ->mapWithKeys(fn (array $menu) => [$menu['key'] => $menu['key'] === 'dashboard'])
            ->all();

        $this->actingAs($admin)
            ->put(route('hak-akses.update'), [
                'loginAccess' => [
                    'admin' => true,
                    'approver' => true,
                    'pemohon' => false,
                ],
                'permissions' => $permissions,
            ])
            ->assertRedirect(route('hak-akses.index'));

        MenuPermissionService::clearCache();

        $this->assertFalse(MenuPermissionService::roleCanLogin(UserRole::Pemohon));
    }

    public function test_non_admin_cannot_access_role_access_page(): void
    {
        $pemohon = User::query()->where('email', 'pemohon1@lapcm.test')->first();

        $this->actingAs($pemohon)
            ->get(route('hak-akses.index'))
            ->assertForbidden();
    }

    public function test_menu_middleware_blocks_revoked_route(): void
    {
        $pemohon = User::query()->where('email', 'pemohon1@lapcm.test')->first();

        MenuPermissionService::syncFromRequest(
            [
                'admin' => collect(MenuPermissionService::menuDefinitions())->mapWithKeys(fn ($m) => [$m['key'] => true])->all(),
                'approver' => collect(MenuPermissionService::menuDefinitions())->mapWithKeys(fn ($m) => [$m['key'] => true])->all(),
                'pemohon' => collect(MenuPermissionService::menuDefinitions())->mapWithKeys(fn ($m) => [$m['key'] => $m['key'] === 'dashboard'])->all(),
            ],
            ['admin' => true, 'approver' => true, 'pemohon' => true],
        );

        $this->actingAs($pemohon)->get(route('pengajuans.index'))->assertForbidden();
        $this->actingAs($pemohon)->get(route('dashboard'))->assertOk();
    }
}

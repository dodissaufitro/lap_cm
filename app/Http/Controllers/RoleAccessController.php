<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ChecksRoles;
use App\Support\ActivityLogger;
use App\Support\MenuPermissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoleAccessController extends Controller
{
    use ChecksRoles;

    public function index(): Response
    {
        $this->ensureAdmin();

        return Inertia::render('hak-akses/index', MenuPermissionService::editorPayload());
    }

    public function update(Request $request): RedirectResponse
    {
        $this->ensureAdmin();

        $roleKeys = MenuPermissionService::roleKeys();
        $menuKeys = collect(MenuPermissionService::menuDefinitions())->pluck('key')->all();

        $validated = $request->validate([
            'loginAccess' => ['required', 'array'],
            'loginAccess.*' => ['boolean'],
            'permissions' => ['required', 'array'],
            'permissions.*' => ['array'],
            'permissions.*.*' => ['boolean'],
        ]);

        $loginAccess = [];
        foreach ($roleKeys as $role) {
            $loginAccess[$role] = (bool) ($validated['loginAccess'][$role] ?? false);
        }

        $permissions = [];
        foreach ($roleKeys as $role) {
            foreach ($menuKeys as $menuKey) {
                $permissions[$role][$menuKey] = (bool) ($validated['permissions'][$role][$menuKey] ?? false);
            }
        }

        MenuPermissionService::syncFromRequest($permissions, $loginAccess);

        ActivityLogger::log('Pengaturan hak akses & menu diperbarui');

        return redirect()
            ->route('hak-akses.index')
            ->with('success', 'Hak akses berhasil disimpan.');
    }
}

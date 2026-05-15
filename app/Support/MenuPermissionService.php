<?php

namespace App\Support;

use App\Enums\UserRole;
use App\Models\RoleLoginSetting;
use App\Models\RoleMenuPermission;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class MenuPermissionService
{
    private const CACHE_KEY = 'menu_permissions_matrix';

    /**
     * @return list<array{key: string, title: string, description: string, path: string, routes: list<string>, default_roles: list<string>}>
     */
    public static function menuDefinitions(): array
    {
        return config('menus.items', []);
    }

    /**
     * @return list<string>
     */
    public static function roleKeys(): array
    {
        return config('menus.roles', ['admin', 'approver', 'pemohon']);
    }

    public static function ensureDefaults(): void
    {
        if (RoleMenuPermission::query()->exists()) {
            return;
        }

        self::seedDefaults();
    }

    public static function seedDefaults(): void
    {
        foreach (self::roleKeys() as $roleValue) {
            $role = UserRole::from($roleValue);

            RoleLoginSetting::query()->updateOrCreate(
                ['role' => $role->value],
                ['can_login' => true],
            );

            foreach (self::menuDefinitions() as $menu) {
                $allowed = in_array($role->value, $menu['default_roles'], true);

                RoleMenuPermission::query()->updateOrCreate(
                    [
                        'role' => $role->value,
                        'menu_key' => $menu['key'],
                    ],
                    ['allowed' => $allowed],
                );
            }
        }

        self::clearCache();
    }

    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * @return array<string, array<string, bool>>
     */
    public static function permissionMatrix(): array
    {
        return Cache::remember(self::CACHE_KEY, 3600, function () {
            $matrix = [];

            foreach (self::roleKeys() as $role) {
                $matrix[$role] = [];
            }

            RoleMenuPermission::query()->get()->each(function (RoleMenuPermission $row) use (&$matrix) {
                $role = $row->role instanceof UserRole ? $row->role->value : (string) $row->role;
                $matrix[$role][$row->menu_key] = $row->allowed;
            });

            return $matrix;
        });
    }

    /**
     * @return array<string, bool>
     */
    public static function loginMatrix(): array
    {
        $matrix = [];

        foreach (self::roleKeys() as $role) {
            $matrix[$role] = true;
        }

        RoleLoginSetting::query()->get()->each(function (RoleLoginSetting $row) use (&$matrix) {
            $role = $row->role instanceof UserRole ? $row->role->value : (string) $row->role;
            $matrix[$role] = $row->can_login;
        });

        return $matrix;
    }

    public static function roleCanLogin(UserRole $role): bool
    {
        $setting = RoleLoginSetting::query()->find($role->value);

        if (! $setting) {
            return in_array($role->value, self::roleKeys(), true);
        }

        return $setting->can_login;
    }

    public static function userCanLogin(User $user): bool
    {
        if (! $user->is_active) {
            return false;
        }

        return self::roleCanLogin($user->role);
    }

    public static function roleCanAccessMenu(UserRole $role, string $menuKey): bool
    {
        if ($menuKey === 'dashboard') {
            return self::permissionMatrix()[$role->value]['dashboard'] ?? true;
        }

        return self::permissionMatrix()[$role->value][$menuKey] ?? false;
    }

    public static function userCanAccessMenu(User $user, string $menuKey): bool
    {
        return self::roleCanAccessMenu($user->role, $menuKey);
    }

    /**
     * @return list<string>
     */
    public static function allowedMenuKeysFor(User $user): array
    {
        $role = $user->role->value;
        $matrix = self::permissionMatrix()[$role] ?? [];

        return collect($matrix)
            ->filter(fn (bool $allowed) => $allowed)
            ->keys()
            ->values()
            ->all();
    }

    public static function menuKeyForRoute(?string $routeName): ?string
    {
        if (! $routeName) {
            return null;
        }

        foreach (self::menuDefinitions() as $menu) {
            foreach ($menu['routes'] as $prefix) {
                if ($routeName === rtrim($prefix, '.') || str_starts_with($routeName, $prefix)) {
                    return $menu['key'];
                }
            }
        }

        return null;
    }

    public static function userCanAccessRoute(User $user, ?string $routeName): bool
    {
        $menuKey = self::menuKeyForRoute($routeName);

        if (! $menuKey) {
            return true;
        }

        return self::userCanAccessMenu($user, $menuKey);
    }

    /**
     * @param  array<string, array<string, bool>>  $permissions
     * @param  array<string, bool>  $loginAccess
     */
    public static function syncFromRequest(array $permissions, array $loginAccess): void
    {
        foreach (self::roleKeys() as $role) {
            RoleLoginSetting::query()->updateOrCreate(
                ['role' => $role],
                ['can_login' => (bool) ($loginAccess[$role] ?? true)],
            );

            foreach (self::menuDefinitions() as $menu) {
                $allowed = (bool) ($permissions[$role][$menu['key']] ?? false);

                RoleMenuPermission::query()->updateOrCreate(
                    [
                        'role' => $role,
                        'menu_key' => $menu['key'],
                    ],
                    ['allowed' => $allowed],
                );
            }
        }

        self::clearCache();
    }

    /**
     * @return array{menus: list<array<string, mixed>>, roles: list<array{value: string, label: string}>, permissions: array<string, array<string, bool>>, loginAccess: array<string, bool>}
     */
    /**
     * @return array{menus: list<array<string, mixed>>, roles: list<array{value: string, label: string}>, permissions: array<string, array<string, bool>>, loginAccess: array<string, bool>}
     */
    public static function editorPayload(): array
    {
        self::ensureDefaults();

        $roles = collect(UserRole::cases())->map(fn (UserRole $role) => [
            'value' => $role->value,
            'label' => $role->label(),
        ])->values()->all();

        return [
            'menus' => self::menuDefinitions(),
            'roles' => $roles,
            'permissions' => self::permissionMatrix(),
            'loginAccess' => self::loginMatrix(),
        ];
    }
}

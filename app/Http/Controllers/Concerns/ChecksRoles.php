<?php

namespace App\Http\Controllers\Concerns;

use App\Enums\UserRole;
use App\Models\User;

trait ChecksRoles
{
    protected function user(): User
    {
        /** @var User $user */
        $user = auth()->user();

        return $user;
    }

    protected function ensureAdmin(): void
    {
        abort_unless($this->user()->isAdmin(), 403);
    }

    protected function ensureAdminOrApprover(): void
    {
        abort_unless($this->user()->isAdmin() || $this->user()->isApprover(), 403);
    }

    /**
     * @param  UserRole|list<UserRole>  $roles
     */
    protected function ensureRole(UserRole|array $roles): void
    {
        $roles = is_array($roles) ? $roles : [$roles];

        abort_unless(in_array($this->user()->role, $roles, true), 403);
    }
}

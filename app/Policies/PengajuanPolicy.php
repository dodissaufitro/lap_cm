<?php

namespace App\Policies;

use App\Models\Pengajuan;
use App\Models\User;

class PengajuanPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isPemohon() || $user->isAdmin() || $user->isApprover();
    }

    public function view(User $user, Pengajuan $pengajuan): bool
    {
        if ($user->isAdmin() || $user->isApprover()) {
            return true;
        }

        return $user->isPemohon() && $this->owns($user, $pengajuan);
    }

    public function create(User $user): bool
    {
        return $user->isPemohon() || $user->isAdmin();
    }

    public function update(User $user, Pengajuan $pengajuan): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isApprover()) {
            return false;
        }

        return $this->owns($user, $pengajuan)
            && in_array($pengajuan->status, ['draft', 'diajukan', 'diproses'], true);
    }

    public function delete(User $user, Pengajuan $pengajuan): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $this->owns($user, $pengajuan)
            && in_array($pengajuan->status, ['draft', 'diajukan'], true);
    }

    private function owns(User $user, Pengajuan $pengajuan): bool
    {
        return (int) $pengajuan->user_id === (int) $user->id;
    }
}

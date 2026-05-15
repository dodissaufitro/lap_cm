<?php

namespace App\Http\Controllers\Concerns;

use App\Enums\UserRole;
use App\Models\Pengajuan;
use App\Models\User;
use Illuminate\Validation\Rule;

trait AssignsPengajuanUser
{
    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    protected function assignPengajuanUserForStore(array $validated, User $actor): array
    {
        if ($actor->isPemohon()) {
            $validated['user_id'] = $actor->id;
            unset($validated['catatan_admin']);

            return $validated;
        }

        $validated['user_id'] = (int) $validated['user_id'];

        return $validated;
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    protected function assignPengajuanUserForUpdate(array $validated, User $actor, Pengajuan $pengajuan): array
    {
        if ($actor->isPemohon()) {
            $validated['user_id'] = $pengajuan->user_id;
            unset($validated['catatan_admin']);

            return $validated;
        }

        if (isset($validated['user_id'])) {
            $validated['user_id'] = (int) $validated['user_id'];
        }

        return $validated;
    }

    /**
     * @return array<string, mixed>
     */
    protected function pengajuanUserRuleForValidation(User $actor): array
    {
        if ($actor->isAdmin()) {
            return [
                'user_id' => [
                    'required',
                    'integer',
                    Rule::exists('users', 'id')->where('role', UserRole::Pemohon->value),
                ],
            ];
        }

        return [];
    }

    /**
     * @return array{id: int, name: string, email: string}
     */
    protected function pengajuanActorPayload(User $actor): array
    {
        return [
            'id' => $actor->id,
            'name' => $actor->name,
            'email' => $actor->email,
        ];
    }
}

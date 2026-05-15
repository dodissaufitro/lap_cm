<?php

namespace App\Support;

use App\Models\LogAktivitas;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

final class ActivityLogger
{
    public static function log(string $aktivitas, ?Model $model = null, ?User $user = null): void
    {
        LogAktivitas::query()->create([
            'user_id' => ($user ?? Auth::user())?->id,
            'aktivitas' => $aktivitas,
            'tabel' => $model?->getTable(),
            'data_id' => $model?->getKey(),
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'created_at' => now(),
        ]);
    }
}

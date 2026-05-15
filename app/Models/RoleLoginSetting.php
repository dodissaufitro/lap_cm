<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Model;

class RoleLoginSetting extends Model
{
    protected $primaryKey = 'role';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'role',
        'can_login',
    ];

    protected function casts(): array
    {
        return [
            'can_login' => 'boolean',
            'role' => UserRole::class,
        ];
    }
}

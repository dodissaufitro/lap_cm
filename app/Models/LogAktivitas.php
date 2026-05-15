<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LogAktivitas extends Model
{
    use HasFactory;

    protected $table = 'log_aktivitas';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'aktivitas',
        'tabel',
        'data_id',
        'data_lama',
        'data_baru',
        'ip_address',
        'user_agent',
        'created_at',
    ];

    protected $casts = [
        'data_lama' => 'array',
        'data_baru' => 'array',
        'created_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIP
    |--------------------------------------------------------------------------
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
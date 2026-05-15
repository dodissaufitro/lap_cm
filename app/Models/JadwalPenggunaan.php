<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JadwalPenggunaan extends Model
{
    use HasFactory;

    protected $fillable = [
        'sarana_id',
        'pengajuan_id',
        'mulai',
        'selesai',
        'status',
    ];

    protected $casts = [
        'mulai' => 'datetime',
        'selesai' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIP
    |--------------------------------------------------------------------------
    */

    public function sarana()
    {
        return $this->belongsTo(Sarana::class);
    }

    public function pengajuan()
    {
        return $this->belongsTo(Pengajuan::class);
    }
}
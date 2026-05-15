<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ApprovalPengajuan extends Model
{
    use HasFactory;

    protected $fillable = [
        'pengajuan_id',
        'approver_id',
        'level_approval',
        'status',
        'catatan',
        'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIP
    |--------------------------------------------------------------------------
    */

    public function pengajuan()
    {
        return $this->belongsTo(Pengajuan::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_id');
    }
}
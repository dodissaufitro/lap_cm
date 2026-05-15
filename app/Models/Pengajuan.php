<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pengajuan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'sarana_id',
        'nomor_pengajuan',
        'tanggal_pengajuan',
        'tanggal_mulai',
        'tanggal_selesai',
        'tujuan_penggunaan',
        'jumlah_peserta',
        'status',
        'catatan_admin',
    ];

    protected $casts = [
        'tanggal_pengajuan' => 'date',
        'tanggal_mulai' => 'datetime',
        'tanggal_selesai' => 'datetime',
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

    public function sarana()
    {
        return $this->belongsTo(Sarana::class);
    }

    public function approvals()
    {
        return $this->hasMany(ApprovalPengajuan::class);
    }

    public function lampirans()
    {
        return $this->hasMany(Lampiran::class);
    }

    public function jadwalPenggunaan()
    {
        return $this->hasOne(JadwalPenggunaan::class);
    }
}
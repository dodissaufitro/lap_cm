<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sarana extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'kategori_sarana_id',
        'nama_sarana',
        'kode_sarana',
        'lokasi',
        'kapasitas',
        'fasilitas',
        'status',
        'foto',
        'keterangan',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIP
    |--------------------------------------------------------------------------
    */

    public function kategori()
    {
        return $this->belongsTo(KategoriSarana::class, 'kategori_sarana_id');
    }

    public function pengajuans()
    {
        return $this->hasMany(Pengajuan::class);
    }

    public function jadwalPenggunaans()
    {
        return $this->hasMany(JadwalPenggunaan::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lampiran extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'pengajuan_id',
        'nama_file',
        'path_file',
        'tipe_file',
        'ukuran_file',
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
}
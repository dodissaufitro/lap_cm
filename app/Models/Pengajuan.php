<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pengajuan extends Model
{
    use HasFactory, SoftDeletes;

    public const SCOPE_FOR_AUTH_USER = 'forAuthUser';

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
        'checked_in_at',
        'checked_out_at',
        'check_in_dokumen_path',
        'check_in_barcode_token',
    ];

    protected $casts = [
        'tanggal_pengajuan' => 'date',
        'tanggal_mulai' => 'datetime',
        'tanggal_selesai' => 'datetime',
        'checked_in_at' => 'datetime',
        'checked_out_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Pengajuan $pengajuan): void {
            $user = auth()->user();

            if ($user instanceof User && $user->isPemohon()) {
                $pengajuan->user_id = $user->id;
            }
        });

        static::updating(function (Pengajuan $pengajuan): void {
            $user = auth()->user();

            if ($user instanceof User && $user->isPemohon()) {
                $pengajuan->user_id = $pengajuan->getOriginal('user_id');
            }
        });

        static::addGlobalScope(self::SCOPE_FOR_AUTH_USER, function (Builder $builder): void {
            if (app()->runningInConsole() && ! app()->runningUnitTests()) {
                return;
            }

            $user = auth()->user();

            if ($user instanceof User && $user->isPemohon()) {
                $builder->ownedBy($user);
            }
        });
    }

    /**
     * Batasi data pengajuan: pemohon hanya melihat milik sendiri.
     *
     * @param  Builder<Pengajuan>  $query
     * @return Builder<Pengajuan>
     */
    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        if ($user->isPemohon()) {
            return $query->ownedBy($user);
        }

        return $query;
    }

    /**
     * @param  Builder<Pengajuan>  $query
     * @return Builder<Pengajuan>
     */
    public function scopeOwnedBy(Builder $query, User $user): Builder
    {
        return $query->where($query->qualifyColumn('user_id'), $user->id);
    }

    public function resolveRouteBinding($value, $field = null)
    {
        $query = static::query()->where($field ?? $this->getRouteKeyName(), $value);

        $user = auth()->user();

        if ($user instanceof User && $user->isPemohon()) {
            $query->ownedBy($user);
        }

        return $query->firstOrFail();
    }

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

<?php

namespace App\Http\Controllers;

use App\Models\Pengajuan;
use Illuminate\View\View;

class TiketVerifikasiController extends Controller
{
    public function show(string $token): View
    {
        $pengajuan = Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
            ->where('check_in_barcode_token', $token)
            ->whereNotNull('checked_in_at')
            ->with([
                'user:id,name,email',
                'sarana:id,nama_sarana,kode_sarana,lokasi,kapasitas,kategori_sarana_id',
                'sarana.kategori:id,nama_kategori',
            ])
            ->firstOrFail();

        return view('tiket.verifikasi', [
            'pengajuan' => $pengajuan,
        ]);
    }
}

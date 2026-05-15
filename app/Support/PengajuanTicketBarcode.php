<?php

namespace App\Support;

use App\Models\Pengajuan;
use Illuminate\Support\Str;

final class PengajuanTicketBarcode
{
    public static function ensureToken(Pengajuan $pengajuan): string
    {
        if ($pengajuan->check_in_barcode_token) {
            return $pengajuan->check_in_barcode_token;
        }

        $token = self::generateToken();

        $pengajuan->update(['check_in_barcode_token' => $token]);

        return $token;
    }

    public static function generateToken(): string
    {
        do {
            $token = Str::lower(Str::random(16));
        } while (Pengajuan::query()->where('check_in_barcode_token', $token)->exists());

        return $token;
    }

    public static function verificationUrl(Pengajuan $pengajuan): string
    {
        $token = self::ensureToken($pengajuan);

        return route('tiket.verifikasi', ['token' => $token], absolute: true);
    }

    public static function barcodePayload(Pengajuan $pengajuan): string
    {
        return self::verificationUrl($pengajuan);
    }

    public static function qrPayload(Pengajuan $pengajuan): string
    {
        return self::verificationUrl($pengajuan);
    }
}

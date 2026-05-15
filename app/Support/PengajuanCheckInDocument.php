<?php

namespace App\Support;

use App\Models\Pengajuan;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class PengajuanCheckInDocument
{
    public static function generate(Pengajuan $pengajuan): string
    {
        $pengajuan->load([
            'user:id,name,email',
            'sarana.kategori:id,nama_kategori',
            'approvals.approver:id,name',
        ]);

        $relativePath = self::storagePath($pengajuan);
        $absolutePath = Storage::disk('public')->path($relativePath);

        Storage::disk('public')->makeDirectory(dirname($relativePath));

        $qrPayload = PengajuanTicketBarcode::qrPayload($pengajuan);

        $pdf = Pdf::loadView('pdf.pengajuan-check-in', [
            'pengajuan' => $pengajuan,
            'statusLabel' => StatusLabel::pengajuanLabel($pengajuan->status),
            'qrCodeBase64' => PengajuanTicketQr::pngBase64($qrPayload),
            'logoDataUri' => self::logoDataUri(),
            'generatedAt' => now()->timezone(config('app.timezone', 'UTC')),
        ])
            ->setPaper('a4', 'portrait')
            ->setOption('isRemoteEnabled', false);

        $pdf->save($absolutePath);

        return $relativePath;
    }

    public static function storagePath(Pengajuan $pengajuan): string
    {
        $slug = Str::slug($pengajuan->nomor_pengajuan);

        return "dokumen/check-in/{$pengajuan->id}-{$slug}.pdf";
    }

    private static function logoDataUri(): ?string
    {
        $relative = config('brand.logo', 'images/logo_tch.png');
        $path = public_path($relative);

        if (! is_file($path) || filesize($path) > 300_000) {
            return null;
        }

        $mime = mime_content_type($path) ?: 'image/png';

        return 'data:'.$mime.';base64,'.base64_encode((string) file_get_contents($path));
    }
}

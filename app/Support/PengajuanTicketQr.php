<?php

namespace App\Support;

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

final class PengajuanTicketQr
{
    public static function pngBase64(string $payload, int $size = 200): string
    {
        $writer = new PngWriter;
        $result = $writer->write(new QrCode(
            data: $payload,
            size: $size,
            margin: 8,
        ));

        return base64_encode($result->getString());
    }
}

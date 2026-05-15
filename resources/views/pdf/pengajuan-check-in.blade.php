<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Bukti Check In — {{ $pengajuan->nomor_pengajuan }}</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #1e293b;
            line-height: 1.45;
            margin: 0;
            padding: 28px 32px;
        }
        .header {
            border-bottom: 2px solid #7c3aed;
            padding-bottom: 14px;
            margin-bottom: 20px;
        }
        .header table { width: 100%; border-collapse: collapse; }
        .header td { vertical-align: middle; }
        .logo { max-height: 52px; max-width: 140px; }
        .title {
            font-size: 18px;
            font-weight: bold;
            color: #5b21b6;
            margin: 0 0 4px;
        }
        .subtitle { font-size: 11px; color: #64748b; margin: 0; }
        .badge {
            display: inline-block;
            background: #ede9fe;
            color: #5b21b6;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .qr-wrap {
            text-align: center;
            margin: 18px 0 22px;
            padding: 14px;
            border: 1px dashed #c4b5fd;
            border-radius: 8px;
            background: #faf5ff;
        }
        .qr-wrap img { width: 140px; height: 140px; }
        .qr-nomor {
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 0.05em;
            margin-top: 8px;
        }
        .qr-hint {
            font-size: 9px;
            color: #64748b;
            margin-top: 6px;
        }
        .section-title {
            font-size: 12px;
            font-weight: bold;
            color: #5b21b6;
            margin: 18px 0 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid #e2e8f0;
        }
        table.data {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
        }
        table.data th,
        table.data td {
            padding: 7px 10px;
            text-align: left;
            vertical-align: top;
            border-bottom: 1px solid #f1f5f9;
        }
        table.data th {
            width: 34%;
            color: #64748b;
            font-weight: normal;
        }
        table.data td { font-weight: 600; }
        .footer {
            margin-top: 28px;
            padding-top: 12px;
            border-top: 1px solid #e2e8f0;
            font-size: 9px;
            color: #94a3b8;
            text-align: center;
        }
        .highlight {
            background: #f0fdf4;
            border-left: 3px solid #22c55e;
            padding: 10px 12px;
            margin: 12px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <table>
            <tr>
                <td style="width: 28%;">
                    @if($logoDataUri)
                        <img src="{{ $logoDataUri }}" alt="Logo" class="logo">
                    @endif
                </td>
                <td>
                    <p class="title">Bukti Check In Pengajuan Sarana</p>
                    <p class="subtitle">{{ config('app.name') }}</p>
                </td>
                <td style="width: 22%; text-align: right;">
                    <span class="badge">Check In</span>
                </td>
            </tr>
        </table>
    </div>

    <div class="qr-wrap">
        <img src="data:image/png;base64,{{ $qrCodeBase64 }}" alt="QR Code">
        <div class="qr-nomor">{{ $pengajuan->nomor_pengajuan }}</div>
        <div class="qr-hint">Scan QR code untuk melihat data pemohon dan sarana</div>
    </div>

    <div class="highlight">
        <strong>Waktu check in:</strong>
        {{ $pengajuan->checked_in_at?->timezone(config('app.timezone'))->translatedFormat('d F Y, H:i') }} WIB
    </div>

    <p class="section-title">Data Pengajuan</p>
    <table class="data">
        <tr>
            <th>Nomor pengajuan</th>
            <td>{{ $pengajuan->nomor_pengajuan }}</td>
        </tr>
        <tr>
            <th>Status</th>
            <td>{{ $statusLabel }}</td>
        </tr>
        <tr>
            <th>Tanggal pengajuan</th>
            <td>{{ $pengajuan->tanggal_pengajuan->translatedFormat('d F Y') }}</td>
        </tr>
        <tr>
            <th>Tanggal mulai</th>
            <td>{{ $pengajuan->tanggal_mulai->timezone(config('app.timezone'))->translatedFormat('d F Y, H:i') }}</td>
        </tr>
        <tr>
            <th>Tanggal selesai</th>
            <td>{{ $pengajuan->tanggal_selesai->timezone(config('app.timezone'))->translatedFormat('d F Y, H:i') }}</td>
        </tr>
        <tr>
            <th>Tujuan penggunaan</th>
            <td>{{ $pengajuan->tujuan_penggunaan }}</td>
        </tr>
        <tr>
            <th>Jumlah peserta</th>
            <td>{{ $pengajuan->jumlah_peserta ?? '—' }}</td>
        </tr>
        @if($pengajuan->catatan_admin)
            <tr>
                <th>Catatan admin</th>
                <td>{{ $pengajuan->catatan_admin }}</td>
            </tr>
        @endif
    </table>

    <p class="section-title">Pemohon</p>
    <table class="data">
        <tr>
            <th>Nama</th>
            <td>{{ $pengajuan->user?->name ?? '—' }}</td>
        </tr>
        <tr>
            <th>Email</th>
            <td>{{ $pengajuan->user?->email ?? '—' }}</td>
        </tr>
    </table>

    <p class="section-title">Sarana</p>
    <table class="data">
        <tr>
            <th>Nama sarana</th>
            <td>{{ $pengajuan->sarana?->nama_sarana ?? '—' }}</td>
        </tr>
        <tr>
            <th>Kode sarana</th>
            <td>{{ $pengajuan->sarana?->kode_sarana ?? '—' }}</td>
        </tr>
        <tr>
            <th>Kategori</th>
            <td>{{ $pengajuan->sarana?->kategori?->nama_kategori ?? '—' }}</td>
        </tr>
    </table>

    @if($pengajuan->approvals->isNotEmpty())
        <p class="section-title">Persetujuan</p>
        <table class="data">
            @foreach($pengajuan->approvals as $approval)
                <tr>
                    <th>Level {{ $approval->level_approval }}</th>
                    <td>
                        {{ ucfirst($approval->status) }}
                        @if($approval->approver)
                            — {{ $approval->approver->name }}
                        @endif
                        @if($approval->approved_at)
                            <br><span style="font-weight: normal; color: #64748b;">{{ $approval->approved_at->translatedFormat('d M Y, H:i') }}</span>
                        @endif
                    </td>
                </tr>
            @endforeach
        </table>
    @endif

    <div class="footer">
        Dokumen ini dibuat otomatis saat check in pada {{ $generatedAt->translatedFormat('d F Y, H:i') }}.
        <br>ID pengajuan: {{ $pengajuan->id }} · {{ config('app.name') }}
    </div>
</body>
</html>

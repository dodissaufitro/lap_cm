<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verifikasi Tiket — {{ $pengajuan->nomor_pengajuan }}</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
            background: #f8fafc;
            color: #0f172a;
            line-height: 1.5;
        }
        .wrap { max-width: 32rem; margin: 0 auto; padding: 1.25rem 1rem 2rem; }
        .card {
            background: #fff;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            padding: 1.25rem;
            margin-bottom: 1rem;
            box-shadow: 0 1px 3px rgb(15 23 42 / 0.06);
        }
        h1 { font-size: 1.125rem; margin: 0 0 0.25rem; color: #5b21b6; }
        h2 {
            font-size: 0.8125rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: #7c3aed;
            margin: 0 0 0.75rem;
        }
        .badge {
            display: inline-block;
            background: #dcfce7;
            color: #166534;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.25rem 0.625rem;
            border-radius: 999px;
            margin-bottom: 1rem;
        }
        dl { margin: 0; }
        .row {
            display: grid;
            grid-template-columns: 7.5rem 1fr;
            gap: 0.25rem 0.75rem;
            padding: 0.5rem 0;
            border-bottom: 1px solid #f1f5f9;
            font-size: 0.875rem;
        }
        .row:last-child { border-bottom: none; }
        dt { color: #64748b; margin: 0; }
        dd { margin: 0; font-weight: 600; }
        .muted { font-size: 0.8125rem; color: #64748b; text-align: center; margin-top: 1rem; }
    </style>
</head>
<body>
    <div class="wrap">
        <div class="card">
            <span class="badge">Tiket valid</span>
            <h1>{{ $pengajuan->nomor_pengajuan }}</h1>
            <p style="margin: 0 0 1rem; font-size: 0.875rem; color: #64748b;">{{ config('app.name') }}</p>

            <h2>Data Pemohon</h2>
            <dl>
                <div class="row">
                    <dt>Nama</dt>
                    <dd>{{ $pengajuan->user?->name ?? '—' }}</dd>
                </div>
                <div class="row">
                    <dt>Email</dt>
                    <dd>{{ $pengajuan->user?->email ?? '—' }}</dd>
                </div>
            </dl>
        </div>

        <div class="card">
            <h2>Sarana Dipilih</h2>
            <dl>
                <div class="row">
                    <dt>Nama sarana</dt>
                    <dd>{{ $pengajuan->sarana?->nama_sarana ?? '—' }}</dd>
                </div>
                <div class="row">
                    <dt>Kode sarana</dt>
                    <dd>{{ $pengajuan->sarana?->kode_sarana ?? '—' }}</dd>
                </div>
                <div class="row">
                    <dt>Kategori</dt>
                    <dd>{{ $pengajuan->sarana?->kategori?->nama_kategori ?? '—' }}</dd>
                </div>
                <div class="row">
                    <dt>Lokasi</dt>
                    <dd>{{ $pengajuan->sarana?->lokasi ?? '—' }}</dd>
                </div>
                <div class="row">
                    <dt>Kapasitas</dt>
                    <dd>{{ $pengajuan->sarana?->kapasitas ?? '—' }}</dd>
                </div>
            </dl>
        </div>

        <p class="muted">Data pemohon dan sarana terverifikasi melalui QR code tiket.</p>
    </div>
</body>
</html>

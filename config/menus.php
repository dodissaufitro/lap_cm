<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Menu aplikasi (hak akses per peran)
    |--------------------------------------------------------------------------
    |
    | key       : pengenal unik untuk izin
    | title     : label tampilan
    | path      : prefix URL (tanpa leading slash)
    | routes    : prefix nama route Laravel
    | default_roles : peran yang boleh mengakses saat pertama kali di-seed
    |
    */

    'items' => [
        [
            'key' => 'dashboard',
            'title' => 'Dashboard',
            'description' => 'Beranda & ringkasan',
            'path' => 'dashboard',
            'routes' => ['dashboard'],
            'default_roles' => ['admin', 'approver', 'pemohon'],
        ],
        [
            'key' => 'pengajuans',
            'title' => 'Pengajuan',
            'description' => 'Ajukan peminjaman sarana',
            'path' => 'pengajuans',
            'routes' => ['pengajuans.'],
            'default_roles' => ['admin', 'approver', 'pemohon'],
        ],
        [
            'key' => 'approval-pengajuans',
            'title' => 'Persetujuan',
            'description' => 'Tinjau & setujui pengajuan',
            'path' => 'approval-pengajuans',
            'routes' => ['approval-pengajuans.'],
            'default_roles' => ['admin', 'approver'],
        ],
        [
            'key' => 'saranas',
            'title' => 'Sarana',
            'description' => 'Data fasilitas & ruangan',
            'path' => 'saranas',
            'routes' => ['saranas.'],
            'default_roles' => ['admin', 'approver', 'pemohon'],
        ],
        [
            'key' => 'kategori-saranas',
            'title' => 'Kategori Sarana',
            'description' => 'Kelompok jenis sarana',
            'path' => 'kategori-saranas',
            'routes' => ['kategori-saranas.'],
            'default_roles' => ['admin'],
        ],
        [
            'key' => 'jadwal-penggunaans',
            'title' => 'Jadwal',
            'description' => 'Jadwal pemakaian sarana',
            'path' => 'jadwal-penggunaans',
            'routes' => ['jadwal-penggunaans.'],
            'default_roles' => ['admin', 'approver'],
        ],
        [
            'key' => 'lampirans',
            'title' => 'Lampiran',
            'description' => 'Berkas & dokumen pendukung',
            'path' => 'lampirans',
            'routes' => ['lampirans.'],
            'default_roles' => ['admin', 'pemohon'],
        ],
        [
            'key' => 'proses',
            'title' => 'Proses',
            'description' => 'Check in & check out pemakaian sarana',
            'path' => 'proses',
            'routes' => ['proses.'],
            'default_roles' => ['admin', 'pemohon'],
        ],
        [
            'key' => 'users',
            'title' => 'Pengguna',
            'description' => 'Kelola akun pengguna',
            'path' => 'users',
            'routes' => ['users.'],
            'default_roles' => ['admin'],
        ],
        [
            'key' => 'log-aktivitas',
            'title' => 'Log Aktivitas',
            'description' => 'Riwayat aktivitas sistem',
            'path' => 'log-aktivitas',
            'routes' => ['log-aktivitas.'],
            'default_roles' => ['admin'],
        ],
        [
            'key' => 'hak-akses',
            'title' => 'Hak Akses',
            'description' => 'Atur login & menu per peran',
            'path' => 'hak-akses',
            'routes' => ['hak-akses.'],
            'default_roles' => ['admin'],
        ],
    ],

    'roles' => ['admin', 'approver', 'pemohon'],

];

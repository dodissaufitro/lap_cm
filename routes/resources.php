<?php

use App\Http\Controllers\ApprovalPengajuanController;
use App\Http\Controllers\JadwalPenggunaanController;
use App\Http\Controllers\KategoriSaranaController;
use App\Http\Controllers\LampiranController;
use App\Http\Controllers\LogAktivitasController;
use App\Http\Controllers\PengajuanController;
use App\Http\Controllers\SaranaController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'active'])->group(function () {
    Route::resource('pengajuans', PengajuanController::class);
    Route::resource('saranas', SaranaController::class);

    Route::get('lampirans/{lampiran}/download', [LampiranController::class, 'download'])->name('lampirans.download');
    Route::resource('lampirans', LampiranController::class)->only(['index', 'create', 'store', 'show', 'destroy']);

    Route::resource('jadwal-penggunaans', JadwalPenggunaanController::class);
    Route::resource('approval-pengajuans', ApprovalPengajuanController::class);

    Route::resource('kategori-saranas', KategoriSaranaController::class);
    Route::resource('users', UserController::class);
    Route::resource('log-aktivitas', LogAktivitasController::class)->only(['index', 'show']);
});

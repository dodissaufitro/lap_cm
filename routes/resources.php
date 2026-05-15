<?php

use App\Http\Controllers\ApprovalPengajuanController;
use App\Http\Controllers\JadwalPenggunaanController;
use App\Http\Controllers\KategoriSaranaController;
use App\Http\Controllers\LampiranController;
use App\Http\Controllers\LogAktivitasController;
use App\Http\Controllers\PengajuanController;
use App\Http\Controllers\ProsesController;
use App\Http\Controllers\RoleAccessController;
use App\Http\Controllers\SaranaController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'active', 'menu'])->group(function () {
    Route::get('hak-akses', [RoleAccessController::class, 'index'])->name('hak-akses.index');
    Route::put('hak-akses', [RoleAccessController::class, 'update'])->name('hak-akses.update');
    Route::get('pengajuans/sarana-availability', [PengajuanController::class, 'saranaAvailability'])
        ->name('pengajuans.sarana-availability');
    Route::prefix('proses')->name('proses.')->group(function () {
        Route::get('/', [ProsesController::class, 'index'])->name('index');
        Route::get('check-in', [ProsesController::class, 'checkInIndex'])->name('check-in.index');
        Route::post('check-in/{pengajuan}', [ProsesController::class, 'checkIn'])->name('check-in.store');
        Route::get('check-in/{pengajuan}/dokumen', [ProsesController::class, 'checkInDocument'])->name('check-in.document');
        Route::get('check-out', [ProsesController::class, 'checkOutIndex'])->name('check-out.index');
        Route::post('check-out/{pengajuan}', [ProsesController::class, 'checkOut'])->name('check-out.store');
    });

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

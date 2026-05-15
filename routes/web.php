<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TiketVerifikasiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function (Request $request) {
    if ($request->user()) {
        return redirect()->route('dashboard');
    }

    return Inertia::render('welcome');
})->name('home');

Route::get('tiket/{token}', [TiketVerifikasiController::class, 'show'])->name('tiket.verifikasi');

Route::middleware(['auth', 'active', 'menu'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/resources.php';

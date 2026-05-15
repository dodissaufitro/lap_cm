<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ChecksRoles;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LogAktivitasController extends Controller
{
    use ChecksRoles;

    public function index(Request $request): Response
    {
        $this->ensureAdmin();

        $search = $request->string('search')->toString();

        $items = LogAktivitas::query()
            ->with('user:id,name')
            ->when($search, fn ($q) => $q->where('aktivitas', 'like', "%{$search}%"))
            ->latest('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('log-aktivitas/index', [
            'items' => $items,
            'filters' => ['search' => $search],
        ]);
    }

    public function show(LogAktivitas $log_aktivita): Response
    {
        $this->ensureAdmin();

        $log_aktivita->load('user:id,name,email');

        return Inertia::render('log-aktivitas/show', [
            'item' => $log_aktivita,
        ]);
    }
}

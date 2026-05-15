<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ChecksRoles;
use App\Models\JadwalPenggunaan;
use App\Models\Pengajuan;
use App\Models\Sarana;
use App\Support\ActivityLogger;
use App\Support\FormOptions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JadwalPenggunaanController extends Controller
{
    use ChecksRoles;

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $query = JadwalPenggunaan::query()
            ->with([
                'sarana:id,nama_sarana',
                'pengajuan:id,nomor_pengajuan,user_id',
                'pengajuan.user:id,name',
            ])
            ->when($this->user()->isPemohon(), fn ($q) => $q->whereHas(
                'pengajuan',
                fn ($q) => $q->where('user_id', $this->user()->id)
            ))
            ->when($search, fn ($q) => $q->whereHas(
                'sarana',
                fn ($q) => $q->where('nama_sarana', 'like', "%{$search}%")
            ))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->orderBy('mulai');

        return Inertia::render('jadwal-penggunaans/index', [
            'items' => $query->paginate(10)->withQueryString(),
            'filters' => ['search' => $search, 'status' => $status],
            'statusOptions' => FormOptions::jadwalStatus(),
            'canManage' => $this->user()->isAdmin(),
        ]);
    }

    public function create(): Response
    {
        $this->ensureAdmin();

        return Inertia::render('jadwal-penggunaans/create', [
            'saranas' => Sarana::query()->orderBy('nama_sarana')->get(['id', 'nama_sarana']),
            'pengajuans' => Pengajuan::query()->where('status', 'disetujui')->with('sarana:id,nama_sarana')->latest()->get(),
            'statusOptions' => FormOptions::jadwalStatus(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'sarana_id' => 'required|exists:saranas,id',
            'pengajuan_id' => 'required|exists:pengajuans,id',
            'mulai' => 'required|date',
            'selesai' => 'required|date|after:mulai',
            'status' => 'required|in:aktif,selesai,dibatalkan',
        ]);

        $jadwal = JadwalPenggunaan::query()->create($validated);

        ActivityLogger::log('Jadwal penggunaan ditambahkan', $jadwal);

        return redirect()->route('jadwal-penggunaans.index')->with('success', 'Jadwal berhasil ditambahkan.');
    }

    public function show(JadwalPenggunaan $jadwalPenggunaan): Response
    {
        $this->authorizeJadwal($jadwalPenggunaan);

        $jadwalPenggunaan->load(['sarana', 'pengajuan.user']);

        return Inertia::render('jadwal-penggunaans/show', [
            'item' => $jadwalPenggunaan,
            'canManage' => $this->user()->isAdmin(),
        ]);
    }

    public function edit(JadwalPenggunaan $jadwalPenggunaan): Response
    {
        $this->ensureAdmin();

        return Inertia::render('jadwal-penggunaans/edit', [
            'item' => $jadwalPenggunaan,
            'saranas' => Sarana::query()->orderBy('nama_sarana')->get(['id', 'nama_sarana']),
            'pengajuans' => Pengajuan::query()->with('sarana:id,nama_sarana')->latest()->get(),
            'statusOptions' => FormOptions::jadwalStatus(),
        ]);
    }

    public function update(Request $request, JadwalPenggunaan $jadwalPenggunaan): RedirectResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'sarana_id' => 'required|exists:saranas,id',
            'pengajuan_id' => 'required|exists:pengajuans,id',
            'mulai' => 'required|date',
            'selesai' => 'required|date|after:mulai',
            'status' => 'required|in:aktif,selesai,dibatalkan',
        ]);

        $jadwalPenggunaan->update($validated);

        ActivityLogger::log('Jadwal penggunaan diperbarui', $jadwalPenggunaan);

        return redirect()->route('jadwal-penggunaans.index')->with('success', 'Jadwal berhasil diperbarui.');
    }

    public function destroy(JadwalPenggunaan $jadwalPenggunaan): RedirectResponse
    {
        $this->ensureAdmin();

        $jadwalPenggunaan->delete();

        ActivityLogger::log('Jadwal penggunaan dihapus', $jadwalPenggunaan);

        return redirect()->route('jadwal-penggunaans.index')->with('success', 'Jadwal berhasil dihapus.');
    }

    private function authorizeJadwal(JadwalPenggunaan $jadwal): void
    {
        if ($this->user()->isPemohon()) {
            abort_unless($jadwal->pengajuan?->user_id === $this->user()->id, 403);
        }
    }
}

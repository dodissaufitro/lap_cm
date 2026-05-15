<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ChecksRoles;
use App\Models\Lampiran;
use App\Models\Pengajuan;
use App\Support\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LampiranController extends Controller
{
    use ChecksRoles;

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $query = Lampiran::query()
            ->with(['pengajuan:id,nomor_pengajuan,user_id', 'pengajuan.user:id,name'])
            ->when($this->user()->isPemohon(), fn ($q) => $q->whereHas(
                'pengajuan',
                fn ($q) => $q->where('user_id', $this->user()->id)
            ))
            ->when($search, fn ($q) => $q->where('nama_file', 'like', "%{$search}%"))
            ->latest();

        return Inertia::render('lampirans/index', [
            'items' => $query->paginate(10)->withQueryString(),
            'filters' => ['search' => $search],
            'canCreate' => $this->user()->isPemohon() || $this->user()->isAdmin(),
        ]);
    }

    public function create(): Response
    {
        abort_unless($this->user()->isPemohon() || $this->user()->isAdmin(), 403);

        $pengajuanQuery = Pengajuan::query()->with('user:id,name')->latest();

        if ($this->user()->isPemohon()) {
            $pengajuanQuery->where('user_id', $this->user()->id);
        }

        return Inertia::render('lampirans/create', [
            'pengajuans' => $pengajuanQuery->get(['id', 'nomor_pengajuan', 'user_id']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($this->user()->isPemohon() || $this->user()->isAdmin(), 403);

        $validated = $request->validate([
            'pengajuan_id' => 'required|exists:pengajuans,id',
            'file' => 'required|file|max:5120|mimes:pdf,jpg,jpeg,png,doc,docx',
        ]);

        $pengajuan = Pengajuan::query()->findOrFail($validated['pengajuan_id']);
        $this->authorizePengajuan($pengajuan);

        $file = $request->file('file');
        $path = $file->store('lampiran', 'public');

        $lampiran = Lampiran::query()->create([
            'pengajuan_id' => $pengajuan->id,
            'nama_file' => $file->getClientOriginalName(),
            'path_file' => $path,
            'tipe_file' => $file->getClientMimeType(),
            'ukuran_file' => $file->getSize(),
        ]);

        ActivityLogger::log("Lampiran \"{$lampiran->nama_file}\" diunggah", $lampiran);

        return redirect()->route('lampirans.index')->with('success', 'Lampiran berhasil diunggah.');
    }

    public function show(Lampiran $lampiran): Response
    {
        $lampiran->load(['pengajuan.user', 'pengajuan.sarana:id,nama_sarana']);
        $this->authorizePengajuan($lampiran->pengajuan);

        return Inertia::render('lampirans/show', [
            'item' => $lampiran,
            'canDelete' => $this->canDelete($lampiran),
        ]);
    }

    public function download(Lampiran $lampiran): StreamedResponse
    {
        $this->authorizePengajuan($lampiran->pengajuan);

        abort_unless(Storage::disk('public')->exists($lampiran->path_file), 404);

        return Storage::disk('public')->download($lampiran->path_file, $lampiran->nama_file);
    }

    public function destroy(Lampiran $lampiran): RedirectResponse
    {
        abort_unless($this->canDelete($lampiran), 403);

        if (Storage::disk('public')->exists($lampiran->path_file)) {
            Storage::disk('public')->delete($lampiran->path_file);
        }

        $nama = $lampiran->nama_file;
        $lampiran->delete();

        ActivityLogger::log("Lampiran \"{$nama}\" dihapus");

        return redirect()->route('lampirans.index')->with('success', 'Lampiran berhasil dihapus.');
    }

    private function authorizePengajuan(?Pengajuan $pengajuan): void
    {
        if (! $pengajuan) {
            abort(404);
        }

        if ($this->user()->isPemohon() && $pengajuan->user_id !== $this->user()->id) {
            abort(403);
        }
    }

    private function canDelete(Lampiran $lampiran): bool
    {
        if ($this->user()->isAdmin()) {
            return true;
        }

        return $this->user()->isPemohon()
            && $lampiran->pengajuan?->user_id === $this->user()->id;
    }
}

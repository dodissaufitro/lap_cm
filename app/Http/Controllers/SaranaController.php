<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ChecksRoles;
use App\Models\KategoriSarana;
use App\Models\Sarana;
use App\Support\ActivityLogger;
use App\Support\FormOptions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SaranaController extends Controller
{
    use ChecksRoles;

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $items = Sarana::query()
            ->with('kategori:id,nama_kategori')
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('nama_sarana', 'like', "%{$search}%")
                    ->orWhere('kode_sarana', 'like', "%{$search}%");
            }))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('saranas/index', [
            'items' => $items,
            'filters' => ['search' => $search],
            'canManage' => $this->user()->isAdmin(),
        ]);
    }

    public function create(): Response
    {
        $this->ensureAdmin();

        return Inertia::render('saranas/create', [
            'kategoris' => KategoriSarana::query()->orderBy('nama_kategori')->get(['id', 'nama_kategori']),
            'statusOptions' => FormOptions::saranaStatus(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->ensureAdmin();

        $validated = $this->validated($request);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('sarana', 'public');
        }

        $sarana = Sarana::query()->create($validated);

        ActivityLogger::log("Sarana \"{$sarana->nama_sarana}\" ditambahkan", $sarana);

        return redirect()->route('saranas.index')->with('success', 'Sarana berhasil ditambahkan.');
    }

    public function show(Sarana $sarana): Response
    {
        $sarana->load('kategori:id,nama_kategori');

        return Inertia::render('saranas/show', [
            'item' => $sarana,
            'canManage' => $this->user()->isAdmin(),
        ]);
    }

    public function edit(Sarana $sarana): Response
    {
        $this->ensureAdmin();

        return Inertia::render('saranas/edit', [
            'item' => $sarana,
            'kategoris' => KategoriSarana::query()->orderBy('nama_kategori')->get(['id', 'nama_kategori']),
            'statusOptions' => FormOptions::saranaStatus(),
        ]);
    }

    public function update(Request $request, Sarana $sarana): RedirectResponse
    {
        $this->ensureAdmin();

        $validated = $this->validated($request, $sarana->id);

        if ($request->hasFile('foto')) {
            if ($sarana->foto && Storage::disk('public')->exists($sarana->foto)) {
                Storage::disk('public')->delete($sarana->foto);
            }
            $validated['foto'] = $request->file('foto')->store('sarana', 'public');
        }

        $sarana->update($validated);

        ActivityLogger::log("Sarana \"{$sarana->nama_sarana}\" diperbarui", $sarana);

        return redirect()->route('saranas.index')->with('success', 'Sarana berhasil diperbarui.');
    }

    public function destroy(Sarana $sarana): RedirectResponse
    {
        $this->ensureAdmin();

        $nama = $sarana->nama_sarana;

        if ($sarana->foto && Storage::disk('public')->exists($sarana->foto)) {
            Storage::disk('public')->delete($sarana->foto);
        }

        $sarana->delete();

        ActivityLogger::log("Sarana \"{$nama}\" dihapus");

        return redirect()->route('saranas.index')->with('success', 'Sarana berhasil dihapus.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?int $ignoreId = null): array
    {
        $uniqueRule = 'unique:saranas,kode_sarana'.($ignoreId ? ','.$ignoreId : '');

        return $request->validate([
            'kategori_sarana_id' => 'required|exists:kategori_saranas,id',
            'nama_sarana' => 'required|string|max:255',
            'kode_sarana' => "required|string|max:255|{$uniqueRule}",
            'lokasi' => 'nullable|string',
            'kapasitas' => 'nullable|integer|min:1',
            'fasilitas' => 'nullable|string',
            'status' => 'required|in:tersedia,maintenance,tidak_aktif',
            'keterangan' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);
    }
}

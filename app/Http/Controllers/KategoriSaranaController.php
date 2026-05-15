<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ChecksRoles;
use App\Models\KategoriSarana;
use App\Support\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KategoriSaranaController extends Controller
{
    use ChecksRoles;

    public function index(Request $request): Response
    {
        $this->ensureAdmin();

        $search = $request->string('search')->toString();

        $items = KategoriSarana::query()
            ->when($search, fn ($q) => $q->where('nama_kategori', 'like', "%{$search}%"))
            ->withCount('saranas')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('kategori-saranas/index', [
            'items' => $items,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        $this->ensureAdmin();

        return Inertia::render('kategori-saranas/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
        ]);

        $kategori = KategoriSarana::query()->create($validated);

        ActivityLogger::log("Kategori sarana \"{$kategori->nama_kategori}\" ditambahkan", $kategori);

        return redirect()->route('kategori-saranas.index')->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function show(KategoriSarana $kategoriSarana): Response
    {
        $this->ensureAdmin();

        $kategoriSarana->loadCount('saranas');

        return Inertia::render('kategori-saranas/show', [
            'item' => $kategoriSarana,
        ]);
    }

    public function edit(KategoriSarana $kategoriSarana): Response
    {
        $this->ensureAdmin();

        return Inertia::render('kategori-saranas/edit', [
            'item' => $kategoriSarana,
        ]);
    }

    public function update(Request $request, KategoriSarana $kategoriSarana): RedirectResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
        ]);

        $kategoriSarana->update($validated);

        ActivityLogger::log("Kategori sarana \"{$kategoriSarana->nama_kategori}\" diperbarui", $kategoriSarana);

        return redirect()->route('kategori-saranas.index')->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(KategoriSarana $kategoriSarana): RedirectResponse
    {
        $this->ensureAdmin();

        $nama = $kategoriSarana->nama_kategori;
        $kategoriSarana->delete();

        ActivityLogger::log("Kategori sarana \"{$nama}\" dihapus");

        return redirect()->route('kategori-saranas.index')->with('success', 'Kategori berhasil dihapus.');
    }
}

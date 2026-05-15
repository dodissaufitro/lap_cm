<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Controllers\Concerns\ChecksRoles;
use App\Models\ApprovalPengajuan;
use App\Models\JadwalPenggunaan;
use App\Models\Pengajuan;
use App\Models\Sarana;
use App\Models\User;
use App\Support\ActivityLogger;
use App\Support\FormOptions;
use App\Support\StatusLabel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengajuanController extends Controller
{
    use ChecksRoles;

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $query = Pengajuan::query()
            ->with(['user:id,name', 'sarana:id,nama_sarana,kode_sarana'])
            ->when($this->user()->isPemohon(), fn ($q) => $q->where('user_id', $this->user()->id))
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('nomor_pengajuan', 'like', "%{$search}%")
                    ->orWhereHas('sarana', fn ($q) => $q->where('nama_sarana', 'like', "%{$search}%"));
            }))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->latest();

        return Inertia::render('pengajuans/index', [
            'items' => $query->paginate(10)->withQueryString(),
            'filters' => ['search' => $search, 'status' => $status],
            'statusOptions' => FormOptions::pengajuanStatus(),
            'canCreate' => $this->user()->isPemohon() || $this->user()->isAdmin(),
        ]);
    }

    public function create(): Response
    {
        abort_unless($this->user()->isPemohon() || $this->user()->isAdmin(), 403);

        return Inertia::render('pengajuans/create', [
            'saranas' => Sarana::query()->where('status', 'tersedia')->orderBy('nama_sarana')->get(['id', 'nama_sarana', 'kode_sarana']),
            'users' => $this->user()->isAdmin()
                ? User::query()->where('role', UserRole::Pemohon)->orderBy('name')->get(['id', 'name'])
                : [],
            'statusOptions' => FormOptions::pengajuanStatus(),
            'isAdmin' => $this->user()->isAdmin(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($this->user()->isPemohon() || $this->user()->isAdmin(), 403);

        $validated = $this->validated($request);

        $validated['user_id'] = $this->user()->isAdmin()
            ? $validated['user_id']
            : $this->user()->id;

        $validated['nomor_pengajuan'] = 'PNG-'.now()->format('Y').'-'.str_pad(
            (string) (Pengajuan::withTrashed()->count() + 1),
            4,
            '0',
            STR_PAD_LEFT
        );

        if ($this->user()->isPemohon() && $validated['status'] === 'draft') {
            // allowed
        } elseif ($this->user()->isPemohon()) {
            $validated['status'] = 'diajukan';
        }

        $pengajuan = Pengajuan::query()->create($validated);

        if (in_array($pengajuan->status, ['diajukan', 'diproses'], true)) {
            $this->createPendingApproval($pengajuan);
        }

        ActivityLogger::log("Pengajuan {$pengajuan->nomor_pengajuan} dibuat", $pengajuan);

        return redirect()->route('pengajuans.index')->with('success', 'Pengajuan berhasil dibuat.');
    }

    public function show(Pengajuan $pengajuan): Response
    {
        $this->authorizePengajuan($pengajuan);

        $pengajuan->load([
            'user:id,name,email',
            'sarana.kategori:id,nama_kategori',
            'approvals.approver:id,name',
            'lampirans',
            'jadwalPenggunaan',
        ]);

        return Inertia::render('pengajuans/show', [
            'item' => $pengajuan,
            'statusLabel' => StatusLabel::pengajuanLabel($pengajuan->status),
            'canEdit' => $this->canEdit($pengajuan),
            'canDelete' => $this->canDelete($pengajuan),
        ]);
    }

    public function edit(Pengajuan $pengajuan): Response
    {
        $this->authorizePengajuan($pengajuan);
        abort_unless($this->canEdit($pengajuan), 403);

        return Inertia::render('pengajuans/edit', [
            'item' => $pengajuan,
            'saranas' => Sarana::query()->orderBy('nama_sarana')->get(['id', 'nama_sarana', 'kode_sarana']),
            'users' => $this->user()->isAdmin()
                ? User::query()->where('role', UserRole::Pemohon)->orderBy('name')->get(['id', 'name'])
                : [],
            'statusOptions' => FormOptions::pengajuanStatus(),
            'isAdmin' => $this->user()->isAdmin(),
        ]);
    }

    public function update(Request $request, Pengajuan $pengajuan): RedirectResponse
    {
        $this->authorizePengajuan($pengajuan);
        abort_unless($this->canEdit($pengajuan), 403);

        $validated = $this->validated($request, $pengajuan);

        if (! $this->user()->isAdmin()) {
            unset($validated['catatan_admin']);
            $validated['user_id'] = $pengajuan->user_id;

            if (! in_array($pengajuan->status, ['draft', 'diajukan', 'revisi'], true)) {
                unset($validated['status']);
            }
        }

        $oldStatus = $pengajuan->status;
        $pengajuan->update($validated);

        if ($oldStatus !== $pengajuan->status && $pengajuan->status === 'disetujui') {
            $this->syncJadwal($pengajuan);
        }

        if ($pengajuan->status === 'diajukan' && ! $pengajuan->approvals()->exists()) {
            $this->createPendingApproval($pengajuan);
        }

        ActivityLogger::log("Pengajuan {$pengajuan->nomor_pengajuan} diperbarui", $pengajuan);

        return redirect()->route('pengajuans.show', $pengajuan)->with('success', 'Pengajuan berhasil diperbarui.');
    }

    public function destroy(Pengajuan $pengajuan): RedirectResponse
    {
        $this->authorizePengajuan($pengajuan);
        abort_unless($this->canDelete($pengajuan), 403);

        $nomor = $pengajuan->nomor_pengajuan;
        $pengajuan->delete();

        ActivityLogger::log("Pengajuan {$nomor} dihapus");

        return redirect()->route('pengajuans.index')->with('success', 'Pengajuan berhasil dihapus.');
    }

    private function authorizePengajuan(Pengajuan $pengajuan): void
    {
        if ($this->user()->isPemohon() && $pengajuan->user_id !== $this->user()->id) {
            abort(403);
        }
    }

    private function canEdit(Pengajuan $pengajuan): bool
    {
        if ($this->user()->isAdmin()) {
            return true;
        }

        if ($this->user()->isApprover()) {
            return false;
        }

        return $pengajuan->user_id === $this->user()->id
            && in_array($pengajuan->status, ['draft', 'diajukan', 'diproses'], true);
    }

    private function canDelete(Pengajuan $pengajuan): bool
    {
        if ($this->user()->isAdmin()) {
            return true;
        }

        return $pengajuan->user_id === $this->user()->id
            && in_array($pengajuan->status, ['draft', 'diajukan'], true);
    }

    private function createPendingApproval(Pengajuan $pengajuan): void
    {
        $approver = User::query()->where('role', UserRole::Approver)->where('is_active', true)->first();

        if (! $approver) {
            return;
        }

        ApprovalPengajuan::query()->firstOrCreate(
            [
                'pengajuan_id' => $pengajuan->id,
                'approver_id' => $approver->id,
                'level_approval' => 1,
            ],
            ['status' => 'pending']
        );
    }

    private function syncJadwal(Pengajuan $pengajuan): void
    {
        JadwalPenggunaan::query()->updateOrCreate(
            ['pengajuan_id' => $pengajuan->id],
            [
                'sarana_id' => $pengajuan->sarana_id,
                'mulai' => $pengajuan->tanggal_mulai,
                'selesai' => $pengajuan->tanggal_selesai,
                'status' => 'aktif',
            ]
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Pengajuan $pengajuan = null): array
    {
        $rules = [
            'sarana_id' => 'required|exists:saranas,id',
            'tanggal_pengajuan' => 'required|date',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'tujuan_penggunaan' => 'required|string',
            'jumlah_peserta' => 'nullable|integer|min:1',
            'status' => 'required|in:draft,diajukan,diproses,disetujui,ditolak,selesai,dibatalkan',
            'catatan_admin' => 'nullable|string',
        ];

        if ($this->user()->isAdmin()) {
            $rules['user_id'] = 'required|exists:users,id';
        }

        return $request->validate($rules);
    }
}

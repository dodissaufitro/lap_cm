<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ChecksRoles;
use App\Models\ApprovalPengajuan;
use App\Models\JadwalPenggunaan;
use App\Models\Pengajuan;
use App\Support\ActivityLogger;
use App\Support\FormOptions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApprovalPengajuanController extends Controller
{
    use ChecksRoles;

    public function index(Request $request): Response
    {
        $this->ensureAdminOrApprover();

        $status = $request->string('status')->toString();

        $query = ApprovalPengajuan::query()
            ->with([
                'pengajuan.sarana:id,nama_sarana',
                'pengajuan.user:id,name',
                'approver:id,name',
            ])
            ->when($this->user()->isApprover(), fn ($q) => $q->where('approver_id', $this->user()->id))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->latest();

        return Inertia::render('approval-pengajuans/index', [
            'items' => $query->paginate(10)->withQueryString(),
            'filters' => ['status' => $status],
            'statusOptions' => FormOptions::approvalStatus(),
            'canCreate' => $this->user()->isAdmin(),
        ]);
    }

    public function create(): Response
    {
        $this->ensureAdmin();

        return Inertia::render('approval-pengajuans/create', [
            'pengajuans' => Pengajuan::query()->with('user:id,name')->latest()->get(['id', 'nomor_pengajuan', 'user_id']),
            'approvers' => \App\Models\User::query()->where('role', \App\Enums\UserRole::Approver)->get(['id', 'name']),
            'statusOptions' => FormOptions::approvalStatus(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'pengajuan_id' => 'required|exists:pengajuans,id',
            'approver_id' => 'required|exists:users,id',
            'level_approval' => 'required|integer|min:1',
            'status' => 'required|in:pending,disetujui,ditolak,revisi',
            'catatan' => 'nullable|string',
        ]);

        if ($validated['status'] !== 'pending') {
            $validated['approved_at'] = now();
        }

        $approval = ApprovalPengajuan::query()->create($validated);

        ActivityLogger::log('Data persetujuan pengajuan ditambahkan', $approval);

        return redirect()->route('approval-pengajuans.index')->with('success', 'Persetujuan berhasil ditambahkan.');
    }

    public function show(ApprovalPengajuan $approvalPengajuan): Response
    {
        $this->authorizeApproval($approvalPengajuan);

        $approvalPengajuan->load(['pengajuan.sarana', 'pengajuan.user', 'approver']);

        return Inertia::render('approval-pengajuans/show', [
            'item' => $approvalPengajuan,
            'canEdit' => $this->canEdit($approvalPengajuan),
        ]);
    }

    public function edit(ApprovalPengajuan $approvalPengajuan): Response
    {
        $this->authorizeApproval($approvalPengajuan);
        abort_unless($this->canEdit($approvalPengajuan), 403);

        return Inertia::render('approval-pengajuans/edit', [
            'item' => $approvalPengajuan->load(['pengajuan', 'approver']),
            'statusOptions' => FormOptions::approvalStatus(),
            'isAdmin' => $this->user()->isAdmin(),
        ]);
    }

    public function update(Request $request, ApprovalPengajuan $approvalPengajuan): RedirectResponse
    {
        $this->authorizeApproval($approvalPengajuan);
        abort_unless($this->canEdit($approvalPengajuan), 403);

        $validated = $request->validate([
            'status' => 'required|in:pending,disetujui,ditolak,revisi',
            'catatan' => 'nullable|string',
        ]);

        if ($validated['status'] === 'pending') {
            $validated['approved_at'] = null;
        } else {
            $validated['approved_at'] = now();
        }

        $approvalPengajuan->update($validated);

        $pengajuan = $approvalPengajuan->pengajuan;

        if ($pengajuan) {
            $pengajuanStatus = match ($validated['status']) {
                'disetujui' => 'disetujui',
                'ditolak' => 'ditolak',
                'revisi' => 'diproses',
                default => $pengajuan->status,
            };

            $pengajuan->update(['status' => $pengajuanStatus]);

            if ($pengajuanStatus === 'disetujui') {
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
        }

        ActivityLogger::log("Persetujuan pengajuan diperbarui menjadi {$validated['status']}", $approvalPengajuan);

        return redirect()->route('approval-pengajuans.index')->with('success', 'Persetujuan berhasil diperbarui.');
    }

    public function destroy(ApprovalPengajuan $approvalPengajuan): RedirectResponse
    {
        $this->ensureAdmin();

        $approvalPengajuan->delete();

        ActivityLogger::log('Data persetujuan pengajuan dihapus', $approvalPengajuan);

        return redirect()->route('approval-pengajuans.index')->with('success', 'Persetujuan berhasil dihapus.');
    }

    private function authorizeApproval(ApprovalPengajuan $approval): void
    {
        $this->ensureAdminOrApprover();

        if ($this->user()->isApprover() && $approval->approver_id !== $this->user()->id) {
            abort(403);
        }
    }

    private function canEdit(ApprovalPengajuan $approval): bool
    {
        if ($this->user()->isAdmin()) {
            return true;
        }

        return $this->user()->isApprover()
            && $approval->approver_id === $this->user()->id;
    }
}

<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Controllers\Concerns\AssignsPengajuanUser;
use App\Http\Controllers\Concerns\ChecksRoles;
use App\Models\ApprovalPengajuan;
use App\Models\JadwalPenggunaan;
use App\Models\Pengajuan;
use App\Models\Sarana;
use App\Models\User;
use App\Support\ActivityLogger;
use App\Support\FormOptions;
use App\Support\SaranaBookingService;
use App\Support\StatusLabel;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengajuanController extends Controller
{
    use AssignsPengajuanUser, ChecksRoles;

    public function __construct(
        private readonly SaranaBookingService $saranaBooking,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Pengajuan::class);

        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $query = Pengajuan::query()
            ->visibleTo($this->user())
            ->with(['user:id,name', 'sarana:id,nama_sarana,kode_sarana'])
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
            'scopeOwnOnly' => $this->user()->isPemohon(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Pengajuan::class);

        $actor = $this->user();

        return Inertia::render('pengajuans/create', [
            'saranas' => Sarana::query()->where('status', 'tersedia')->orderBy('nama_sarana')->get(['id', 'nama_sarana', 'kode_sarana']),
            'users' => $actor->isAdmin()
                ? User::query()->where('role', UserRole::Pemohon)->orderBy('name')->get(['id', 'name'])
                : [],
            'authUser' => $this->pengajuanActorPayload($actor),
            'statusOptions' => FormOptions::pengajuanStatus(),
            'isAdmin' => $actor->isAdmin(),
            'isPemohon' => $actor->isPemohon(),
        ]);
    }

    public function saranaAvailability(Request $request): JsonResponse
    {
        $this->authorize('create', Pengajuan::class);

        $validated = $request->validate([
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'except_pengajuan_id' => 'nullable|integer|exists:pengajuans,id',
        ]);

        $mulai = Carbon::parse($validated['tanggal_mulai']);
        $selesai = Carbon::parse($validated['tanggal_selesai']);
        $exceptId = isset($validated['except_pengajuan_id']) ? (int) $validated['except_pengajuan_id'] : null;

        if ($exceptId) {
            $this->authorize('view', Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)->findOrFail($exceptId));
        }

        $saranas = $this->selectableSaranas($exceptId);

        return response()->json([
            'saranas' => $this->saranaBooking->availabilityPayload($saranas, $mulai, $selesai, $exceptId),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Pengajuan::class);

        $actor = $this->user();
        $validated = $this->validated($request, $actor);
        $validated = $this->assignPengajuanUserForStore($validated, $actor);

        $validated['nomor_pengajuan'] = $this->generateNomorPengajuan();

        $pengajuan = Pengajuan::query()->create($validated);

        if (in_array($pengajuan->status, ['diajukan', 'diproses'], true)) {
            $this->createPendingApproval($pengajuan);
        }

        ActivityLogger::log("Pengajuan {$pengajuan->nomor_pengajuan} dibuat", $pengajuan);

        return redirect()->route('pengajuans.index')->with('success', 'Pengajuan berhasil dibuat.');
    }

    public function show(Pengajuan $pengajuan): Response
    {
        $this->authorize('view', $pengajuan);

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
            'canEdit' => $this->user()->can('update', $pengajuan),
            'canDelete' => $this->user()->can('delete', $pengajuan),
            'checkInDocumentUrl' => $pengajuan->check_in_dokumen_path
                ? route('proses.check-in.document', $pengajuan)
                : null,
        ]);
    }

    public function edit(Pengajuan $pengajuan): Response
    {
        $this->authorize('update', $pengajuan);

        $actor = $this->user();

        return Inertia::render('pengajuans/edit', [
            'item' => $this->pengajuanFormItem($pengajuan),
            'saranas' => $this->selectableSaranas($pengajuan->id),
            'users' => $actor->isAdmin()
                ? User::query()->where('role', UserRole::Pemohon)->orderBy('name')->get(['id', 'name'])
                : [],
            'authUser' => $this->pengajuanActorPayload($actor),
            'statusOptions' => FormOptions::pengajuanStatus(),
            'isAdmin' => $actor->isAdmin(),
            'isPemohon' => $actor->isPemohon(),
        ]);
    }

    public function update(Request $request, Pengajuan $pengajuan): RedirectResponse
    {
        $this->authorize('update', $pengajuan);

        $actor = $this->user();
        $validated = $this->validated($request, $actor, $pengajuan);
        $validated = $this->assignPengajuanUserForUpdate($validated, $actor, $pengajuan);

        if ($actor->isPemohon() && ! in_array($pengajuan->status, ['draft', 'diajukan'], true)) {
            unset($validated['status']);
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
        $this->authorize('delete', $pengajuan);

        $nomor = $pengajuan->nomor_pengajuan;
        $pengajuan->delete();

        ActivityLogger::log("Pengajuan {$nomor} dihapus");

        return redirect()->route('pengajuans.index')->with('success', 'Pengajuan berhasil dihapus.');
    }

    /**
     * @return Collection<int, Sarana>
     */
    private function selectableSaranas(?int $includeSaranaIdFromPengajuan = null)
    {
        return Sarana::query()
            ->where(function ($query) use ($includeSaranaIdFromPengajuan) {
                $query->where('status', 'tersedia');

                if ($includeSaranaIdFromPengajuan) {
                    $pengajuan = Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
                        ->find($includeSaranaIdFromPengajuan);

                    if ($pengajuan) {
                        $query->orWhere('id', $pengajuan->sarana_id);
                    }
                }
            })
            ->orderBy('nama_sarana')
            ->get(['id', 'nama_sarana', 'kode_sarana']);
    }

    private function generateNomorPengajuan(): string
    {
        $year = now()->format('Y');
        $prefix = "PNG-{$year}-";

        $lastSequence = Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
            ->withTrashed()
            ->where('nomor_pengajuan', 'like', $prefix.'%')
            ->pluck('nomor_pengajuan')
            ->map(function (string $nomor) use ($prefix): int {
                $suffix = substr($nomor, strlen($prefix));

                return ctype_digit($suffix) ? (int) $suffix : 0;
            })
            ->max() ?? 0;

        return $prefix.str_pad((string) ($lastSequence + 1), 4, '0', STR_PAD_LEFT);
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
    private function validated(Request $request, ?User $actor = null, ?Pengajuan $pengajuan = null): array
    {
        $actor ??= $this->user();

        $rules = [
            'sarana_id' => 'required|exists:saranas,id',
            'tanggal_pengajuan' => 'required|date',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'tujuan_penggunaan' => 'required|string',
            'jumlah_peserta' => 'nullable|integer|min:1',
            'status' => 'required|in:draft,diajukan,diproses,disetujui,ditolak,selesai,dibatalkan',
            'catatan_admin' => 'nullable|string',
            ...$this->pengajuanUserRuleForValidation($actor),
        ];

        if ($actor->isPemohon()) {
            if ($pengajuan === null || in_array($pengajuan->status, ['draft', 'diajukan'], true)) {
                $rules['status'] = 'required|in:draft,diajukan';
            } else {
                unset($rules['status']);
            }
        }

        $validated = $request->validate($rules);

        $this->saranaBooking->assertAvailable(
            (int) $validated['sarana_id'],
            Carbon::parse($validated['tanggal_mulai']),
            Carbon::parse($validated['tanggal_selesai']),
            $pengajuan?->id,
        );

        return $validated;
    }

    /**
     * @return array<string, mixed>
     */
    private function pengajuanFormItem(Pengajuan $pengajuan): array
    {
        $pengajuan->loadMissing('user:id,name,email');

        return [
            'id' => $pengajuan->id,
            'nomor_pengajuan' => $pengajuan->nomor_pengajuan,
            'sarana_id' => $pengajuan->sarana_id,
            'user_id' => $pengajuan->user_id,
            'tanggal_pengajuan' => $pengajuan->tanggal_pengajuan?->format('Y-m-d') ?? '',
            'tanggal_mulai' => $pengajuan->tanggal_mulai?->format('Y-m-d\TH:i') ?? '',
            'tanggal_selesai' => $pengajuan->tanggal_selesai?->format('Y-m-d\TH:i') ?? '',
            'tujuan_penggunaan' => $pengajuan->tujuan_penggunaan,
            'jumlah_peserta' => $pengajuan->jumlah_peserta,
            'status' => $pengajuan->status,
            'catatan_admin' => $pengajuan->catatan_admin,
            'user' => $pengajuan->user ? [
                'id' => $pengajuan->user->id,
                'name' => $pengajuan->user->name,
                'email' => $pengajuan->user->email,
            ] : null,
        ];
    }
}

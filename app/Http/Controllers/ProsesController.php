<?php

namespace App\Http\Controllers;

use App\Models\Pengajuan;
use App\Models\User;
use App\Support\PengajuanCheckInDocument;
use App\Support\PengajuanProsesService;
use App\Support\PengajuanTicketBarcode;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class ProsesController extends Controller
{
    public function index(Request $request): Response
    {
        PengajuanProsesService::cancelExpiredWithoutCheckIn();

        $user = $request->user();

        return Inertia::render('proses/index', [
            'counts' => [
                'checkIn' => $this->checkInListQuery($user)->count(),
                'checkOut' => $this->checkOutQuery($user)->count(),
            ],
        ]);
    }

    public function checkInIndex(Request $request): Response
    {
        PengajuanProsesService::cancelExpiredWithoutCheckIn();

        $user = $request->user();

        $items = $this->checkInListQuery($user)
            ->with(['sarana:id,nama_sarana,kode_sarana'])
            ->orderBy('tanggal_mulai')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Pengajuan $pengajuan) => [
                'id' => $pengajuan->id,
                'nomor_pengajuan' => $pengajuan->nomor_pengajuan,
                'tanggal_mulai' => $pengajuan->tanggal_mulai,
                'tanggal_selesai' => $pengajuan->tanggal_selesai,
                'status' => $pengajuan->status,
                'checked_in_at' => $pengajuan->checked_in_at,
                'has_checked_in' => $pengajuan->checked_in_at !== null,
                'can_check_in' => $pengajuan->checked_in_at === null && PengajuanProsesService::isOnEventDay($pengajuan),
                'can_print_ticket' => $pengajuan->checked_in_at !== null && $pengajuan->check_in_dokumen_path,
                'ticket_url' => $pengajuan->check_in_dokumen_path
                    ? route('proses.check-in.document', $pengajuan)
                    : null,
                'status_label' => PengajuanProsesService::checkInStatusLabel($pengajuan),
                'sarana' => $pengajuan->sarana,
            ]);

        return Inertia::render('proses/check-in/index', [
            'items' => $items,
        ]);
    }

    public function checkOutIndex(Request $request): Response
    {
        $user = $request->user();

        $items = $this->checkOutQuery($user)
            ->with(['sarana:id,nama_sarana,kode_sarana'])
            ->orderBy('tanggal_selesai')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('proses/check-out/index', [
            'items' => $items,
        ]);
    }

    public function checkIn(Pengajuan $pengajuan): RedirectResponse
    {
        $this->authorizeCheckIn($pengajuan);

        PengajuanProsesService::performCheckIn($pengajuan);

        return to_route('proses.check-in.index')
            ->with('success', 'Check in berhasil. Gunakan tombol Cetak Tiket untuk mengunduh bukti.');
    }

    public function checkInDocument(Pengajuan $pengajuan): SymfonyResponse
    {
        $this->authorizeCheckInDocument($pengajuan);

        PengajuanTicketBarcode::ensureToken($pengajuan);
        $path = PengajuanCheckInDocument::generate($pengajuan->fresh());
        $pengajuan->update(['check_in_dokumen_path' => $path]);
        $pengajuan->refresh();

        abort_unless(
            $pengajuan->check_in_dokumen_path && Storage::disk('public')->exists($pengajuan->check_in_dokumen_path),
            404,
            'Dokumen check in tidak ditemukan.',
        );

        $filename = 'bukti-check-in-'.str_replace('/', '-', $pengajuan->nomor_pengajuan).'.pdf';

        return response()->file(
            Storage::disk('public')->path($pengajuan->check_in_dokumen_path),
            [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="'.$filename.'"',
            ],
        );
    }

    public function checkOut(Pengajuan $pengajuan): RedirectResponse
    {
        $this->authorizeCheckOut($pengajuan);

        PengajuanProsesService::performCheckOut($pengajuan);

        return to_route('proses.check-out.index')
            ->with('success', 'Check out berhasil. Status pengajuan menjadi selesai.');
    }

    /**
     * @return Builder<Pengajuan>
     */
    private function checkInListQuery(User $user): Builder
    {
        return Pengajuan::query()
            ->visibleTo($user)
            ->where('status', 'disetujui')
            ->whereNull('checked_out_at');
    }

    /**
     * @return Builder<Pengajuan>
     */
    private function checkInPendingQuery(User $user): Builder
    {
        return Pengajuan::query()
            ->visibleTo($user)
            ->where('status', 'disetujui')
            ->whereNull('checked_in_at')
            ->whereNull('checked_out_at');
    }

    /**
     * @return Builder<Pengajuan>
     */
    private function checkOutQuery(User $user): Builder
    {
        return Pengajuan::query()
            ->visibleTo($user)
            ->where('status', 'disetujui')
            ->whereNotNull('checked_in_at')
            ->whereNull('checked_out_at');
    }

    private function authorizeCheckIn(Pengajuan $pengajuan): void
    {
        $user = auth()->user();

        abort_unless($user, 403);

        if ($user->isPemohon() && $pengajuan->user_id !== $user->id) {
            abort(403);
        }

        abort_if($pengajuan->checked_in_at, 403, 'Pengajuan sudah di-check in.');

        abort_unless(
            PengajuanProsesService::isOnEventDay($pengajuan),
            403,
            'Check in hanya dapat dilakukan pada tanggal mulai acara.',
        );

        abort_unless($this->checkInPendingQuery($user)->whereKey($pengajuan->id)->exists(), 403, 'Pengajuan tidak dapat di-check in.');
    }

    private function authorizeCheckOut(Pengajuan $pengajuan): void
    {
        $user = auth()->user();

        abort_unless($user, 403);

        if ($user->isPemohon() && $pengajuan->user_id !== $user->id) {
            abort(403);
        }

        abort_unless($this->checkOutQuery($user)->whereKey($pengajuan->id)->exists(), 403, 'Pengajuan tidak dapat di-check out.');
    }

    private function authorizeCheckInDocument(Pengajuan $pengajuan): void
    {
        $user = auth()->user();

        abort_unless($user, 403);

        if ($user->isPemohon() && $pengajuan->user_id !== $user->id) {
            abort(403);
        }

        abort_unless($pengajuan->checked_in_at, 403);
    }
}

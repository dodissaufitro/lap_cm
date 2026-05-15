<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\ApprovalPengajuan;
use App\Models\JadwalPenggunaan;
use App\Models\LogAktivitas;
use App\Models\Pengajuan;
use App\Models\Sarana;
use App\Models\User;
use App\Support\DashboardMenuCounts;
use App\Support\StatusLabel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('dashboard', [
            'menuCounts' => DashboardMenuCounts::forUser($user),
            'stats' => $this->stats($user),
            'recentPengajuans' => $this->recentPengajuans($user),
            'saranaByStatus' => $this->saranaByStatus(),
            'recentActivities' => $this->recentActivities($user),
            'upcomingSchedules' => $this->upcomingSchedules($user),
            'pendingApprovals' => $user->role === UserRole::Approver || $user->role === UserRole::Admin
                ? $this->pendingApprovals($user)
                : 0,
        ]);
    }

    /**
     * @return list<array{title: string, value: int, icon: string, trend?: string}>
     */
    private function stats(User $user): array
    {
        $pengajuanQuery = Pengajuan::query();
        $today = now()->toDateString();

        if ($user->role === UserRole::Pemohon) {
            $pengajuanQuery->where('user_id', $user->id);

            return [
                [
                    'title' => 'Pengajuan Saya',
                    'value' => (clone $pengajuanQuery)->count(),
                    'icon' => 'file',
                ],
                [
                    'title' => 'Hari Ini',
                    'value' => (clone $pengajuanQuery)->whereDate('tanggal_pengajuan', $today)->count(),
                    'icon' => 'calendar',
                ],
                [
                    'title' => 'Disetujui',
                    'value' => (clone $pengajuanQuery)->where('status', 'disetujui')->count(),
                    'icon' => 'check',
                ],
                [
                    'title' => 'Menunggu',
                    'value' => (clone $pengajuanQuery)->whereIn('status', ['diajukan', 'diproses'])->count(),
                    'icon' => 'clock',
                ],
            ];
        }

        if ($user->role === UserRole::Approver) {
            return [
                [
                    'title' => 'Menunggu Persetujuan',
                    'value' => ApprovalPengajuan::query()
                        ->where('approver_id', $user->id)
                        ->where('status', 'pending')
                        ->count(),
                    'icon' => 'clock',
                ],
                [
                    'title' => 'Pengajuan Hari Ini',
                    'value' => Pengajuan::query()->whereDate('tanggal_pengajuan', $today)->count(),
                    'icon' => 'calendar',
                ],
                [
                    'title' => 'Disetujui',
                    'value' => Pengajuan::query()->where('status', 'disetujui')->count(),
                    'icon' => 'check',
                ],
                [
                    'title' => 'Ditolak',
                    'value' => Pengajuan::query()->where('status', 'ditolak')->count(),
                    'icon' => 'x',
                ],
            ];
        }

        return [
            [
                'title' => 'Total Sarana',
                'value' => Sarana::query()->count(),
                'icon' => 'building',
            ],
            [
                'title' => 'Pengajuan Hari Ini',
                'value' => Pengajuan::query()->whereDate('tanggal_pengajuan', $today)->count(),
                'icon' => 'calendar',
            ],
            [
                'title' => 'Disetujui',
                'value' => Pengajuan::query()->where('status', 'disetujui')->count(),
                'icon' => 'check',
            ],
            [
                'title' => 'Ditolak',
                'value' => Pengajuan::query()->where('status', 'ditolak')->count(),
                'icon' => 'x',
            ],
        ];
    }

    /**
     * @return list<array{id: int, nomor: string, sarana: string, pemohon: string, tanggal: string, status: string, status_label: string}>
     */
    private function recentPengajuans(User $user): array
    {
        $query = Pengajuan::query()
            ->with(['user:id,name', 'sarana:id,nama_sarana'])
            ->latest();

        if ($user->role === UserRole::Pemohon) {
            $query->where('user_id', $user->id);
        }

        return $query
            ->limit(8)
            ->get()
            ->map(fn (Pengajuan $pengajuan) => [
                'id' => $pengajuan->id,
                'nomor' => $pengajuan->nomor_pengajuan,
                'sarana' => $pengajuan->sarana?->nama_sarana ?? '-',
                'pemohon' => $pengajuan->user?->name ?? '-',
                'tanggal' => $pengajuan->tanggal_pengajuan->translatedFormat('d M Y'),
                'status' => $pengajuan->status,
                'status_label' => StatusLabel::pengajuanLabel($pengajuan->status),
            ])
            ->all();
    }

    /**
     * @return list<array{status: string, label: string, count: int}>
     */
    private function saranaByStatus(): array
    {
        $counts = Sarana::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return collect(['tersedia', 'maintenance', 'tidak_aktif'])
            ->map(fn (string $status) => [
                'status' => $status,
                'label' => StatusLabel::saranaLabel($status),
                'count' => (int) ($counts[$status] ?? 0),
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<array{id: int, aktivitas: string, user: string|null, waktu: string}>
     */
    private function recentActivities(User $user): array
    {
        $query = LogAktivitas::query()
            ->with('user:id,name')
            ->latest('created_at');

        if ($user->role === UserRole::Pemohon) {
            $query->where('user_id', $user->id);
        }

        return $query
            ->limit(6)
            ->get()
            ->map(fn (LogAktivitas $log) => [
                'id' => $log->id,
                'aktivitas' => $log->aktivitas,
                'user' => $log->user?->name,
                'waktu' => $log->created_at?->diffForHumans() ?? '-',
            ])
            ->all();
    }

    /**
     * @return list<array{id: int, sarana: string, pemohon: string, mulai: string, selesai: string, status: string}>
     */
    private function upcomingSchedules(User $user): array
    {
        $query = JadwalPenggunaan::query()
            ->with([
                'sarana:id,nama_sarana',
                'pengajuan.user:id,name',
            ])
            ->where('status', 'aktif')
            ->where('mulai', '>=', now())
            ->orderBy('mulai');

        if ($user->role === UserRole::Pemohon) {
            $query->whereHas('pengajuan', fn ($q) => $q->where('user_id', $user->id));
        }

        return $query
            ->limit(5)
            ->get()
            ->map(fn (JadwalPenggunaan $jadwal) => [
                'id' => $jadwal->id,
                'sarana' => $jadwal->sarana?->nama_sarana ?? '-',
                'pemohon' => $jadwal->pengajuan?->user?->name ?? '-',
                'mulai' => $jadwal->mulai->translatedFormat('d M Y, H:i'),
                'selesai' => $jadwal->selesai->translatedFormat('d M Y, H:i'),
                'status' => $jadwal->status,
            ])
            ->all();
    }

    private function pendingApprovals(User $user): int
    {
        $query = ApprovalPengajuan::query()->where('status', 'pending');

        if ($user->role === UserRole::Approver) {
            $query->where('approver_id', $user->id);
        }

        return $query->count();
    }
}

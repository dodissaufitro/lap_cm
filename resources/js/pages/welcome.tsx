import GuestHubLayout from '@/layouts/guest-hub-layout';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';

const stats = [
    { title: 'Total Sarana', value: 24, icon: '🏢' },
    { title: 'Pengajuan Hari Ini', value: 12, icon: '📄' },
    { title: 'Disetujui', value: 8, icon: '✅' },
    { title: 'Ditolak', value: 2, icon: '❌' },
] as const;

const pengajuanTerbaru = [
    { nama: 'Aula Serbaguna', pemohon: 'Dodis Saufitro', tanggal: '15 Mei 2026', status: 'Disetujui' },
    { nama: 'Lapangan Basket', pemohon: 'Budi Santoso', tanggal: '15 Mei 2026', status: 'Pending' },
    { nama: 'Mobil Operasional', pemohon: 'Siti Rahma', tanggal: '14 Mei 2026', status: 'Ditolak' },
] as const;

const statusSarana = [
    { label: 'Tersedia', count: '18 Sarana', emoji: '🟢', tone: 'emerald' },
    { label: 'Maintenance', count: '4 Sarana', emoji: '🟡', tone: 'amber' },
    { label: 'Tidak Aktif', count: '2 Sarana', emoji: '🔴', tone: 'rose' },
] as const;

const aktivitasHariIni = [
    { text: 'Pengajuan Aula Serbaguna disetujui', waktu: '5 menit lalu' },
    { text: 'Pengajuan Mobil Operasional ditolak', waktu: '20 menit lalu' },
    { text: 'Sarana baru berhasil ditambahkan', waktu: '1 jam lalu' },
] as const;

const statusBadgeClass: Record<string, string> = {
    Disetujui:
        'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-200',
    Ditolak: 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-400/30 dark:bg-rose-500/15 dark:text-rose-200',
    Pending: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-200',
};

const saranaToneClass: Record<string, string> = {
    emerald: 'border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-500/10',
    amber: 'border-amber-200 bg-amber-50 dark:border-amber-400/20 dark:bg-amber-500/10',
    rose: 'border-rose-200 bg-rose-50 dark:border-rose-400/20 dark:bg-rose-500/10',
};

export default function Welcome() {
    return (
        <GuestHubLayout>
            <Head title="Beranda" />

            <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 sm:gap-6 lg:gap-7 2xl:max-w-7xl">
                <div className="grid grid-cols-1 gap-4 min-[380px]:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                    {stats.map((item) => (
                        <div
                            key={item.title}
                            className="hub-glass-card hub-glass-card-interactive flex min-h-[7.5rem] flex-col justify-between p-5 sm:min-h-[8.5rem] sm:p-6"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">{item.title}</p>
                                    <p className="mt-2 text-3xl font-bold tabular-nums text-foreground sm:text-4xl">
                                        {item.value}
                                    </p>
                                </div>
                                <span className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl sm:size-14 sm:text-3xl dark:bg-white/10">
                                    {item.icon}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
                    <div className="hub-glass-card p-5 sm:p-6 lg:col-span-2">
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-lg font-bold text-foreground sm:text-xl">Pengajuan Terbaru</h2>
                            <input
                                type="text"
                                placeholder="Cari pengajuan..."
                                className="h-10 w-full rounded-xl border border-slate-200 bg-white/90 px-4 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/25 dark:border-white/15 dark:bg-white/5 dark:shadow-none sm:max-w-xs"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[32rem] border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left text-sm text-muted-foreground dark:border-white/10">
                                        <th className="pb-3 pr-4 font-medium">Sarana</th>
                                        <th className="pb-3 pr-4 font-medium">Pemohon</th>
                                        <th className="pb-3 pr-4 font-medium">Tanggal</th>
                                        <th className="pb-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pengajuanTerbaru.map((item) => (
                                        <tr key={item.nama} className="border-b border-slate-100 last:border-0 dark:border-white/5">
                                            <td className="py-3.5 pr-4 font-medium text-foreground">{item.nama}</td>
                                            <td className="py-3.5 pr-4 text-muted-foreground">{item.pemohon}</td>
                                            <td className="py-3.5 pr-4 text-muted-foreground">{item.tanggal}</td>
                                            <td className="py-3.5">
                                                <span
                                                    className={cn(
                                                        'inline-flex rounded-full border px-3 py-1 text-xs font-semibold',
                                                        statusBadgeClass[item.status] ?? statusBadgeClass.Pending,
                                                    )}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 lg:gap-6">
                        <div className="hub-glass-card p-5 sm:p-6">
                            <h2 className="mb-4 text-lg font-bold text-foreground sm:text-xl">Status Sarana</h2>
                            <div className="space-y-3">
                                {statusSarana.map((item) => (
                                    <div
                                        key={item.label}
                                        className={cn(
                                            'flex items-center justify-between rounded-2xl border p-4',
                                            saranaToneClass[item.tone],
                                        )}
                                    >
                                        <div>
                                            <h3 className="font-semibold text-foreground">{item.label}</h3>
                                            <p className="mt-0.5 text-sm text-muted-foreground">{item.count}</p>
                                        </div>
                                        <span className="text-2xl">{item.emoji}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="hub-glass-card p-5 sm:p-6">
                            <h2 className="mb-4 text-lg font-bold text-foreground sm:text-xl">Aktivitas Hari Ini</h2>
                            <div className="space-y-4">
                                {aktivitasHariIni.map((item) => (
                                    <div key={item.text} className="flex items-start gap-3">
                                        <span className="mt-0.5 text-lg" aria-hidden>
                                            📌
                                        </span>
                                        <div>
                                            <p className="font-medium text-foreground">{item.text}</p>
                                            <p className="mt-0.5 text-sm text-muted-foreground">{item.waktu}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestHubLayout>
    );
}

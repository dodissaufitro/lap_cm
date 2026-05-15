import { DeleteButton } from '@/components/crud/delete-button';
import { FlashAlert } from '@/components/crud/flash-alert';
import { PageHeader } from '@/components/crud/page-header';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatDate, formatDatetime } from '@/lib/datetime';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

interface Approval {
    id: number;
    level_approval: number;
    status: string;
    catatan: string | null;
    approver?: { id: number; name: string };
}

interface Lampiran {
    id: number;
    nama_file: string;
}

interface Jadwal {
    id: number;
    mulai: string;
    selesai: string;
    status: string;
}

interface Pengajuan {
    id: number;
    nomor_pengajuan: string;
    tanggal_pengajuan: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    tujuan_penggunaan: string;
    jumlah_peserta: number | null;
    status: string;
    catatan_admin: string | null;
    user?: { id: number; name: string; email: string };
    sarana?: { id: number; nama_sarana: string; kode_sarana: string; kategori?: { nama_kategori: string } };
    approvals?: Approval[];
    lampirans?: Lampiran[];
    jadwal_penggunaan?: Jadwal | null;
}

interface Props {
    item: Pengajuan;
    statusLabel: string;
    canEdit: boolean;
    canDelete: boolean;
    checkInDocumentUrl?: string | null;
}

const approvalLabels: Record<string, string> = {
    pending: 'Menunggu',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
    revisi: 'Revisi',
};

export default function PengajuansShow({ item, statusLabel, canEdit, canDelete }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengajuan', href: '/pengajuans' },
        { title: item.nomor_pengajuan, href: route('pengajuans.show', item.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={item.nomor_pengajuan} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title={item.nomor_pengajuan}
                    actions={
                        <>
                            {checkInDocumentUrl && (
                                <Button variant="secondary" asChild>
                                    <a href={checkInDocumentUrl} target="_blank" rel="noopener noreferrer">
                                        Cetak Tiket
                                    </a>
                                </Button>
                            )}
                            {canEdit && (
                                <Button variant="secondary" asChild>
                                    <Link href={route('pengajuans.edit', item.id)}>
                                        <Pencil className="size-4" />
                                        Edit
                                    </Link>
                                </Button>
                            )}
                            {canDelete && <DeleteButton href={route('pengajuans.destroy', item.id)} />}
                        </>
                    }
                />

                <FlashAlert />

                <div className="hub-surface p-6">
                    <dl className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm text-muted-foreground">Status</dt>
                            <dd className="mt-1">
                                <StatusBadge status={item.status} label={statusLabel} />
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Pemohon</dt>
                            <dd className="mt-1 font-medium">{item.user?.name ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Sarana</dt>
                            <dd className="mt-1 font-medium">
                                {item.sarana?.nama_sarana ?? '-'}
                                {item.sarana?.kode_sarana && (
                                    <span className="ml-2 font-mono text-xs text-muted-foreground">
                                        ({item.sarana.kode_sarana})
                                    </span>
                                )}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Kategori</dt>
                            <dd className="mt-1">{item.sarana?.kategori?.nama_kategori ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Tanggal Pengajuan</dt>
                            <dd className="mt-1">{formatDate(item.tanggal_pengajuan)}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Jumlah Peserta</dt>
                            <dd className="mt-1">{item.jumlah_peserta ?? '-'}</dd>
                        </div>
                        {!item.jadwal_penggunaan && (
                            <>
                                <div>
                                    <dt className="text-sm text-muted-foreground">Waktu Mulai</dt>
                                    <dd className="mt-1">{formatDatetime(item.tanggal_mulai)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-muted-foreground">Waktu Selesai</dt>
                                    <dd className="mt-1">{formatDatetime(item.tanggal_selesai)}</dd>
                                </div>
                            </>
                        )}
                        <div className="sm:col-span-2">
                            <dt className="text-sm text-muted-foreground">Tujuan Penggunaan</dt>
                            <dd className="mt-1 whitespace-pre-wrap">{item.tujuan_penggunaan}</dd>
                        </div>
                        {item.catatan_admin && (
                            <div className="sm:col-span-2">
                                <dt className="text-sm text-muted-foreground">Catatan Admin</dt>
                                <dd className="mt-1 whitespace-pre-wrap">{item.catatan_admin}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                {item.approvals && item.approvals.length > 0 && (
                    <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
                        <h2 className="border-b border-border/60 px-6 py-4 text-lg font-semibold">Persetujuan</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[560px] border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-border/60 text-left text-muted-foreground">
                                        <th className="px-6 py-3 font-medium">Level</th>
                                        <th className="px-6 py-3 font-medium">Approver</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="px-6 py-3 font-medium">Catatan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.approvals.map((a) => (
                                        <tr key={a.id} className="border-b border-border/40 last:border-0">
                                            <td className="px-6 py-3">{a.level_approval}</td>
                                            <td className="px-6 py-3">{a.approver?.name ?? '-'}</td>
                                            <td className="px-6 py-3">
                                                <StatusBadge
                                                    status={a.status}
                                                    label={approvalLabels[a.status] ?? a.status}
                                                />
                                            </td>
                                            <td className="px-6 py-3 text-muted-foreground">{a.catatan || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {item.lampirans && item.lampirans.length > 0 && (
                    <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
                        <h2 className="border-b border-border/60 px-6 py-4 text-lg font-semibold">Lampiran</h2>
                        <ul className="divide-y divide-border/60">
                            {item.lampirans.map((l) => (
                                <li key={l.id} className="flex items-center justify-between px-6 py-3">
                                    <span>{l.nama_file}</span>
                                    <Button variant="link" size="sm" asChild>
                                        <Link href={route('lampirans.show', l.id)}>Lihat</Link>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {item.jadwal_penggunaan && (
                    <div className="hub-surface p-6">
                        <h2 className="mb-4 text-lg font-semibold">Jadwal Penggunaan</h2>
                        <dl className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <dt className="text-sm text-muted-foreground">Mulai</dt>
                                <dd className="mt-1">{formatDatetime(item.jadwal_penggunaan.mulai)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Selesai</dt>
                                <dd className="mt-1">{formatDatetime(item.jadwal_penggunaan.selesai)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Status Jadwal</dt>
                                <dd className="mt-1 capitalize">{item.jadwal_penggunaan.status}</dd>
                            </div>
                        </dl>
                        <Button variant="link" className="mt-4 px-0" asChild>
                            <Link href={route('jadwal-penggunaans.show', item.jadwal_penggunaan.id)}>
                                Detail jadwal
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

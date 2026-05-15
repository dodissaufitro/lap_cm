import { DeleteButton } from '@/components/crud/delete-button';
import { FlashAlert } from '@/components/crud/flash-alert';
import { PageHeader } from '@/components/crud/page-header';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatDatetime } from '@/lib/datetime';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

interface Approval {
    id: number;
    level_approval: number;
    status: string;
    catatan: string | null;
    approved_at: string | null;
    pengajuan?: {
        id: number;
        nomor_pengajuan: string;
        sarana?: { nama_sarana: string };
        user?: { name: string };
    };
    approver?: { name: string; email?: string };
}

interface Props {
    item: Approval;
    canEdit: boolean;
}

const statusLabels: Record<string, string> = {
    pending: 'Menunggu',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
    revisi: 'Revisi',
};

export default function ApprovalPengajuansShow({ item, canEdit }: Props) {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user.role === 'admin';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Persetujuan', href: '/approval-pengajuans' },
        { title: item.pengajuan?.nomor_pengajuan ?? 'Detail', href: route('approval-pengajuans.show', item.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Persetujuan" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title="Detail Persetujuan"
                    actions={
                        <>
                            {canEdit && (
                                <Button variant="secondary" asChild>
                                    <Link href={route('approval-pengajuans.edit', item.id)}>
                                        <Pencil className="size-4" />
                                        Edit
                                    </Link>
                                </Button>
                            )}
                            {isAdmin && <DeleteButton href={route('approval-pengajuans.destroy', item.id)} />}
                        </>
                    }
                />

                <FlashAlert />

                <div className="hub-surface p-6">
                    <dl className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm text-muted-foreground">Pengajuan</dt>
                            <dd className="mt-1 font-medium">
                                {item.pengajuan ? (
                                    <Link
                                        href={route('pengajuans.show', item.pengajuan.id)}
                                        className="text-primary hover:underline"
                                    >
                                        {item.pengajuan.nomor_pengajuan}
                                    </Link>
                                ) : (
                                    '-'
                                )}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Sarana</dt>
                            <dd className="mt-1">{item.pengajuan?.sarana?.nama_sarana ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Pemohon</dt>
                            <dd className="mt-1">{item.pengajuan?.user?.name ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Approver</dt>
                            <dd className="mt-1">{item.approver?.name ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Level</dt>
                            <dd className="mt-1">{item.level_approval}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Status</dt>
                            <dd className="mt-1">
                                <StatusBadge status={item.status} label={statusLabels[item.status] ?? item.status} />
                            </dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm text-muted-foreground">Catatan</dt>
                            <dd className="mt-1 whitespace-pre-wrap">{item.catatan || '-'}</dd>
                        </div>
                        {item.approved_at && (
                            <div>
                                <dt className="text-sm text-muted-foreground">Disetujui Pada</dt>
                                <dd className="mt-1">{formatDatetime(item.approved_at)}</dd>
                            </div>
                        )}
                    </dl>
                </div>
            </div>
        </AppLayout>
    );
}

import { DeleteButton } from '@/components/crud/delete-button';
import { FlashAlert } from '@/components/crud/flash-alert';
import { PageHeader } from '@/components/crud/page-header';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatDatetime } from '@/lib/datetime';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

interface Jadwal {
    id: number;
    mulai: string;
    selesai: string;
    status: string;
    sarana?: { nama_sarana: string; kode_sarana?: string };
    pengajuan?: { id: number; nomor_pengajuan: string; user?: { name: string } };
}

interface Props {
    item: Jadwal;
    canManage: boolean;
}

export default function JadwalPenggunaansShow({ item, canManage }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Jadwal', href: '/jadwal-penggunaans' },
        { title: 'Detail', href: route('jadwal-penggunaans.show', item.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Jadwal" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title="Detail Jadwal Penggunaan"
                    actions={
                        canManage ? (
                            <>
                                <Button variant="secondary" asChild>
                                    <Link href={route('jadwal-penggunaans.edit', item.id)}>
                                        <Pencil className="size-4" />
                                        Edit
                                    </Link>
                                </Button>
                                <DeleteButton href={route('jadwal-penggunaans.destroy', item.id)} />
                            </>
                        ) : undefined
                    }
                />

                <FlashAlert />

                <div className="hub-surface p-6">
                    <dl className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm text-muted-foreground">Sarana</dt>
                            <dd className="mt-1 font-medium">{item.sarana?.nama_sarana ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Pengajuan</dt>
                            <dd className="mt-1">
                                {item.pengajuan ? (
                                    <Link
                                        href={route('pengajuans.show', item.pengajuan.id)}
                                        className="font-medium text-primary hover:underline"
                                    >
                                        {item.pengajuan.nomor_pengajuan}
                                    </Link>
                                ) : (
                                    '-'
                                )}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Pemohon</dt>
                            <dd className="mt-1">{item.pengajuan?.user?.name ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Status</dt>
                            <dd className="mt-1 capitalize">{item.status}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Mulai</dt>
                            <dd className="mt-1">{formatDatetime(item.mulai)}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Selesai</dt>
                            <dd className="mt-1">{formatDatetime(item.selesai)}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </AppLayout>
    );
}

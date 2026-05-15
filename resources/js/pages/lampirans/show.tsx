import { DeleteButton } from '@/components/crud/delete-button';
import { FlashAlert } from '@/components/crud/flash-alert';
import { PageHeader } from '@/components/crud/page-header';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Download } from 'lucide-react';

interface Lampiran {
    id: number;
    nama_file: string;
    path_file: string;
    tipe_file: string | null;
    ukuran_file: number | null;
    pengajuan?: {
        id: number;
        nomor_pengajuan: string;
        user?: { name: string };
        sarana?: { nama_sarana: string };
    };
}

interface Props {
    item: Lampiran;
    canDelete: boolean;
}

function formatSize(bytes: number | null): string {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function LampiransShow({ item, canDelete }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Lampiran', href: '/lampirans' },
        { title: item.nama_file, href: route('lampirans.show', item.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={item.nama_file} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title={item.nama_file}
                    actions={
                        <>
                            <Button asChild>
                                <a href={route('lampirans.download', item.id)}>
                                    <Download className="size-4" />
                                    Unduh
                                </a>
                            </Button>
                            {canDelete && <DeleteButton href={route('lampirans.destroy', item.id)} />}
                        </>
                    }
                />

                <FlashAlert />

                <div className="hub-surface p-6">
                    <dl className="grid gap-4 sm:grid-cols-2">
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
                            <dt className="text-sm text-muted-foreground">Sarana</dt>
                            <dd className="mt-1">{item.pengajuan?.sarana?.nama_sarana ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Tipe File</dt>
                            <dd className="mt-1">{item.tipe_file ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Ukuran</dt>
                            <dd className="mt-1">{formatSize(item.ukuran_file)}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </AppLayout>
    );
}

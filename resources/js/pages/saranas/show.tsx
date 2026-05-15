import { DeleteButton } from '@/components/crud/delete-button';
import { FlashAlert } from '@/components/crud/flash-alert';
import { PageHeader } from '@/components/crud/page-header';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

interface Sarana {
    id: number;
    nama_sarana: string;
    kode_sarana: string;
    lokasi: string | null;
    kapasitas: number | null;
    fasilitas: string | null;
    status: string;
    keterangan: string | null;
    foto: string | null;
    kategori?: { id: number; nama_kategori: string };
}

interface Props {
    item: Sarana;
    canManage: boolean;
}

const statusLabels: Record<string, string> = {
    tersedia: 'Tersedia',
    maintenance: 'Maintenance',
    tidak_aktif: 'Tidak Aktif',
};

export default function SaranasShow({ item, canManage }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Sarana', href: '/saranas' },
        { title: item.nama_sarana, href: route('saranas.show', item.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={item.nama_sarana} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title={item.nama_sarana}
                    actions={
                        canManage ? (
                            <>
                                <Button variant="secondary" asChild>
                                    <Link href={route('saranas.edit', item.id)}>
                                        <Pencil className="size-4" />
                                        Edit
                                    </Link>
                                </Button>
                                <DeleteButton href={route('saranas.destroy', item.id)} />
                            </>
                        ) : undefined
                    }
                />

                <FlashAlert />

                {item.foto && (
                    <div className="hub-table-wrap">
                        <img src={`/storage/${item.foto}`} alt={item.nama_sarana} className="max-h-80 w-full object-cover" />
                    </div>
                )}

                <div className="hub-surface p-6">
                    <dl className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm text-muted-foreground">Kode</dt>
                            <dd className="mt-1 font-mono font-medium">{item.kode_sarana}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Kategori</dt>
                            <dd className="mt-1 font-medium">{item.kategori?.nama_kategori ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Status</dt>
                            <dd className="mt-1">
                                <StatusBadge
                                    status={item.status}
                                    label={statusLabels[item.status] ?? item.status}
                                    variant="sarana"
                                />
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Lokasi</dt>
                            <dd className="mt-1">{item.lokasi || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Kapasitas</dt>
                            <dd className="mt-1">{item.kapasitas ?? '-'}</dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm text-muted-foreground">Fasilitas</dt>
                            <dd className="mt-1 whitespace-pre-wrap">{item.fasilitas || '-'}</dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm text-muted-foreground">Keterangan</dt>
                            <dd className="mt-1 whitespace-pre-wrap">{item.keterangan || '-'}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </AppLayout>
    );
}

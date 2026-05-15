import { DeleteButton } from '@/components/crud/delete-button';
import { FlashAlert } from '@/components/crud/flash-alert';
import { PageHeader } from '@/components/crud/page-header';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/datetime';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

interface KategoriSarana {
    id: number;
    nama_kategori: string;
    deskripsi: string | null;
    saranas_count?: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    item: KategoriSarana;
}

export default function KategoriSaranasShow({ item }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Kategori Sarana', href: '/kategori-saranas' },
        { title: item.nama_kategori, href: route('kategori-saranas.show', item.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={item.nama_kategori} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title={item.nama_kategori}
                    actions={
                        <>
                            <Button variant="secondary" asChild>
                                <Link href={route('kategori-saranas.edit', item.id)}>
                                    <Pencil className="size-4" />
                                    Edit
                                </Link>
                            </Button>
                            <DeleteButton href={route('kategori-saranas.destroy', item.id)} />
                        </>
                    }
                />

                <FlashAlert />

                <div className="hub-surface p-6">
                    <dl className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm text-muted-foreground">Nama Kategori</dt>
                            <dd className="mt-1 font-medium">{item.nama_kategori}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Jumlah Sarana</dt>
                            <dd className="mt-1 font-medium">{item.saranas_count ?? 0}</dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm text-muted-foreground">Deskripsi</dt>
                            <dd className="mt-1 whitespace-pre-wrap">{item.deskripsi || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Dibuat</dt>
                            <dd className="mt-1">{formatDate(item.created_at)}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Diperbarui</dt>
                            <dd className="mt-1">{formatDate(item.updated_at)}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </AppLayout>
    );
}

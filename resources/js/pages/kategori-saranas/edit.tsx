import { FlashAlert } from '@/components/crud/flash-alert';
import { FormCard } from '@/components/crud/form-card';
import { PageHeader } from '@/components/crud/page-header';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface KategoriSarana {
    id: number;
    nama_kategori: string;
    deskripsi: string | null;
}

interface Props {
    item: KategoriSarana;
}

export default function KategoriSaranasEdit({ item }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Kategori Sarana', href: '/kategori-saranas' },
        { title: item.nama_kategori, href: route('kategori-saranas.show', item.id) },
        { title: 'Edit', href: route('kategori-saranas.edit', item.id) },
    ];

    const { data, setData, put, processing, errors } = useForm({
        nama_kategori: item.nama_kategori,
        deskripsi: item.deskripsi ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('kategori-saranas.update', item.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${item.nama_kategori}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader title="Edit Kategori Sarana" description={item.nama_kategori} />

                <FlashAlert />

                <FormCard>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="nama_kategori">Nama Kategori</Label>
                            <Input
                                id="nama_kategori"
                                value={data.nama_kategori}
                                onChange={(e) => setData('nama_kategori', e.target.value)}
                                required
                            />
                            <InputError message={errors.nama_kategori} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <textarea
                                id="deskripsi"
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                rows={4}
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <InputError message={errors.deskripsi} />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button type="submit" disabled={processing}>
                                Simpan Perubahan
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={route('kategori-saranas.show', item.id)}>Batal</Link>
                            </Button>
                        </div>
                    </form>
                </FormCard>
            </div>
        </AppLayout>
    );
}

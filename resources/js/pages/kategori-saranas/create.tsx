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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kategori Sarana', href: '/kategori-saranas' },
    { title: 'Tambah', href: '/kategori-saranas/create' },
];

export default function KategoriSaranasCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nama_kategori: '',
        deskripsi: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('kategori-saranas.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kategori Sarana" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader title="Tambah Kategori Sarana" description="Buat kategori sarana baru" />

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
                                Simpan
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={route('kategori-saranas.index')}>Batal</Link>
                            </Button>
                        </div>
                    </form>
                </FormCard>
            </div>
        </AppLayout>
    );
}

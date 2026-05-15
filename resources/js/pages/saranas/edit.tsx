import { FlashAlert } from '@/components/crud/flash-alert';
import { FormCard } from '@/components/crud/form-card';
import { FormSelect } from '@/components/crud/form-select';
import { PageHeader } from '@/components/crud/page-header';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type SelectOption } from '@/types/crud';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Sarana {
    id: number;
    kategori_sarana_id: number;
    nama_sarana: string;
    kode_sarana: string;
    lokasi: string | null;
    kapasitas: number | null;
    fasilitas: string | null;
    status: string;
    keterangan: string | null;
    foto: string | null;
}

interface Kategori {
    id: number;
    nama_kategori: string;
}

interface Props {
    item: Sarana;
    kategoris: Kategori[];
    statusOptions: SelectOption[];
}

export default function SaranasEdit({ item, kategoris, statusOptions }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Sarana', href: '/saranas' },
        { title: item.nama_sarana, href: route('saranas.show', item.id) },
        { title: 'Edit', href: route('saranas.edit', item.id) },
    ];

    const { data, setData, put, processing, errors } = useForm({
        kategori_sarana_id: String(item.kategori_sarana_id),
        nama_sarana: item.nama_sarana,
        kode_sarana: item.kode_sarana,
        lokasi: item.lokasi ?? '',
        kapasitas: item.kapasitas ? String(item.kapasitas) : '',
        fasilitas: item.fasilitas ?? '',
        status: item.status,
        keterangan: item.keterangan ?? '',
        foto: null as File | null,
    });

    const kategoriOptions: SelectOption[] = kategoris.map((k) => ({
        value: String(k.id),
        label: k.nama_kategori,
    }));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('saranas.update', item.id), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${item.nama_sarana}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader title="Edit Sarana" description={item.nama_sarana} />

                <FlashAlert />

                <FormCard>
                    <form onSubmit={submit} className="space-y-6">
                        <FormSelect
                            id="kategori_sarana_id"
                            label="Kategori"
                            value={data.kategori_sarana_id}
                            onChange={(v) => setData('kategori_sarana_id', v)}
                            options={kategoriOptions}
                            error={errors.kategori_sarana_id}
                        />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="nama_sarana">Nama Sarana</Label>
                                <Input
                                    id="nama_sarana"
                                    value={data.nama_sarana}
                                    onChange={(e) => setData('nama_sarana', e.target.value)}
                                    required
                                />
                                <InputError message={errors.nama_sarana} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="kode_sarana">Kode Sarana</Label>
                                <Input
                                    id="kode_sarana"
                                    value={data.kode_sarana}
                                    onChange={(e) => setData('kode_sarana', e.target.value)}
                                    required
                                />
                                <InputError message={errors.kode_sarana} />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="lokasi">Lokasi</Label>
                                <Input id="lokasi" value={data.lokasi} onChange={(e) => setData('lokasi', e.target.value)} />
                                <InputError message={errors.lokasi} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="kapasitas">Kapasitas</Label>
                                <Input
                                    id="kapasitas"
                                    type="number"
                                    min={1}
                                    value={data.kapasitas}
                                    onChange={(e) => setData('kapasitas', e.target.value)}
                                />
                                <InputError message={errors.kapasitas} />
                            </div>
                        </div>

                        <FormSelect
                            id="status"
                            label="Status"
                            value={data.status}
                            onChange={(v) => setData('status', v)}
                            options={statusOptions}
                            error={errors.status}
                        />

                        <div className="grid gap-2">
                            <Label htmlFor="fasilitas">Fasilitas</Label>
                            <textarea
                                id="fasilitas"
                                value={data.fasilitas}
                                onChange={(e) => setData('fasilitas', e.target.value)}
                                rows={3}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <InputError message={errors.fasilitas} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="keterangan">Keterangan</Label>
                            <textarea
                                id="keterangan"
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                                rows={3}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <InputError message={errors.keterangan} />
                        </div>

                        {item.foto && (
                            <div className="grid gap-2">
                                <Label>Foto Saat Ini</Label>
                                <img
                                    src={`/storage/${item.foto}`}
                                    alt={item.nama_sarana}
                                    className="max-h-48 rounded-xl border object-cover"
                                />
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="foto">Ganti Foto</Label>
                            <Input
                                id="foto"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => setData('foto', e.target.files?.[0] ?? null)}
                            />
                            <InputError message={errors.foto} />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button type="submit" disabled={processing}>
                                Simpan Perubahan
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={route('saranas.show', item.id)}>Batal</Link>
                            </Button>
                        </div>
                    </form>
                </FormCard>
            </div>
        </AppLayout>
    );
}

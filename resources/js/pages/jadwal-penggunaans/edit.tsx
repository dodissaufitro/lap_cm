import { FlashAlert } from '@/components/crud/flash-alert';
import { FormCard } from '@/components/crud/form-card';
import { FormSelect } from '@/components/crud/form-select';
import { PageHeader } from '@/components/crud/page-header';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { toDatetimeLocal } from '@/lib/datetime';
import { type BreadcrumbItem } from '@/types';
import { type SelectOption } from '@/types/crud';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Jadwal {
    id: number;
    sarana_id: number;
    pengajuan_id: number;
    mulai: string;
    selesai: string;
    status: string;
}

interface Sarana {
    id: number;
    nama_sarana: string;
}

interface Pengajuan {
    id: number;
    nomor_pengajuan: string;
    sarana?: { nama_sarana: string };
}

interface Props {
    item: Jadwal;
    saranas: Sarana[];
    pengajuans: Pengajuan[];
    statusOptions: SelectOption[];
}

export default function JadwalPenggunaansEdit({ item, saranas, pengajuans, statusOptions }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Jadwal', href: '/jadwal-penggunaans' },
        { title: 'Edit', href: route('jadwal-penggunaans.edit', item.id) },
    ];

    const { data, setData, put, processing, errors } = useForm({
        sarana_id: String(item.sarana_id),
        pengajuan_id: String(item.pengajuan_id),
        mulai: toDatetimeLocal(item.mulai),
        selesai: toDatetimeLocal(item.selesai),
        status: item.status,
    });

    const saranaOptions: SelectOption[] = saranas.map((s) => ({
        value: String(s.id),
        label: s.nama_sarana,
    }));

    const pengajuanOptions: SelectOption[] = pengajuans.map((p) => ({
        value: String(p.id),
        label: `${p.nomor_pengajuan}${p.sarana ? ` — ${p.sarana.nama_sarana}` : ''}`,
    }));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('jadwal-penggunaans.update', item.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Jadwal" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader title="Edit Jadwal Penggunaan" />

                <FlashAlert />

                <FormCard>
                    <form onSubmit={submit} className="space-y-6">
                        <FormSelect
                            id="sarana_id"
                            label="Sarana"
                            value={data.sarana_id}
                            onChange={(v) => setData('sarana_id', v)}
                            options={saranaOptions}
                            error={errors.sarana_id}
                        />

                        <FormSelect
                            id="pengajuan_id"
                            label="Pengajuan"
                            value={data.pengajuan_id}
                            onChange={(v) => setData('pengajuan_id', v)}
                            options={pengajuanOptions}
                            error={errors.pengajuan_id}
                        />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="mulai">Mulai</Label>
                                <Input
                                    id="mulai"
                                    type="datetime-local"
                                    value={data.mulai}
                                    onChange={(e) => setData('mulai', e.target.value)}
                                    required
                                />
                                <InputError message={errors.mulai} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="selesai">Selesai</Label>
                                <Input
                                    id="selesai"
                                    type="datetime-local"
                                    value={data.selesai}
                                    onChange={(e) => setData('selesai', e.target.value)}
                                    required
                                />
                                <InputError message={errors.selesai} />
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

                        <div className="flex flex-wrap gap-2">
                            <Button type="submit" disabled={processing}>
                                Simpan Perubahan
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={route('jadwal-penggunaans.show', item.id)}>Batal</Link>
                            </Button>
                        </div>
                    </form>
                </FormCard>
            </div>
        </AppLayout>
    );
}

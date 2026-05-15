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
    nama_sarana: string;
}

interface Pengajuan {
    id: number;
    nomor_pengajuan: string;
    sarana_id: number;
    sarana?: { nama_sarana: string };
}

interface Props {
    saranas: Sarana[];
    pengajuans: Pengajuan[];
    statusOptions: SelectOption[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Jadwal', href: '/jadwal-penggunaans' },
    { title: 'Tambah', href: '/jadwal-penggunaans/create' },
];

export default function JadwalPenggunaansCreate({ saranas, pengajuans, statusOptions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        sarana_id: saranas[0] ? String(saranas[0].id) : '',
        pengajuan_id: pengajuans[0] ? String(pengajuans[0].id) : '',
        mulai: '',
        selesai: '',
        status: statusOptions[0]?.value ?? 'aktif',
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
        post(route('jadwal-penggunaans.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Jadwal" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader title="Tambah Jadwal" description="Buat jadwal penggunaan sarana" />

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
                                Simpan
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={route('jadwal-penggunaans.index')}>Batal</Link>
                            </Button>
                        </div>
                    </form>
                </FormCard>
            </div>
        </AppLayout>
    );
}

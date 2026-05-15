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

interface Pengajuan {
    id: number;
    nomor_pengajuan: string;
    user_id: number;
    user?: { name: string };
}

interface Approver {
    id: number;
    name: string;
}

interface Props {
    pengajuans: Pengajuan[];
    approvers: Approver[];
    statusOptions: SelectOption[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Persetujuan', href: '/approval-pengajuans' },
    { title: 'Tambah', href: '/approval-pengajuans/create' },
];

export default function ApprovalPengajuansCreate({ pengajuans, approvers, statusOptions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        pengajuan_id: pengajuans[0] ? String(pengajuans[0].id) : '',
        approver_id: approvers[0] ? String(approvers[0].id) : '',
        level_approval: '1',
        status: 'pending',
        catatan: '',
    });

    const pengajuanOptions: SelectOption[] = pengajuans.map((p) => ({
        value: String(p.id),
        label: p.nomor_pengajuan,
    }));

    const approverOptions: SelectOption[] = approvers.map((a) => ({
        value: String(a.id),
        label: a.name,
    }));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('approval-pengajuans.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Persetujuan" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader title="Tambah Persetujuan" description="Buat entri persetujuan manual" />

                <FlashAlert />

                <FormCard>
                    <form onSubmit={submit} className="space-y-6">
                        <FormSelect
                            id="pengajuan_id"
                            label="Pengajuan"
                            value={data.pengajuan_id}
                            onChange={(v) => setData('pengajuan_id', v)}
                            options={pengajuanOptions}
                            error={errors.pengajuan_id}
                        />

                        <FormSelect
                            id="approver_id"
                            label="Approver"
                            value={data.approver_id}
                            onChange={(v) => setData('approver_id', v)}
                            options={approverOptions}
                            error={errors.approver_id}
                        />

                        <div className="grid gap-2">
                            <Label htmlFor="level_approval">Level Persetujuan</Label>
                            <Input
                                id="level_approval"
                                type="number"
                                min={1}
                                value={data.level_approval}
                                onChange={(e) => setData('level_approval', e.target.value)}
                                required
                            />
                            <InputError message={errors.level_approval} />
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
                            <Label htmlFor="catatan">Catatan</Label>
                            <textarea
                                id="catatan"
                                value={data.catatan}
                                onChange={(e) => setData('catatan', e.target.value)}
                                rows={3}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <InputError message={errors.catatan} />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button type="submit" disabled={processing}>
                                Simpan
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={route('approval-pengajuans.index')}>Batal</Link>
                            </Button>
                        </div>
                    </form>
                </FormCard>
            </div>
        </AppLayout>
    );
}

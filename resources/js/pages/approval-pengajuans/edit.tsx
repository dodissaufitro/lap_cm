import { FlashAlert } from '@/components/crud/flash-alert';
import { FormCard } from '@/components/crud/form-card';
import { FormSelect } from '@/components/crud/form-select';
import { PageHeader } from '@/components/crud/page-header';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type SelectOption } from '@/types/crud';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Approval {
    id: number;
    status: string;
    catatan: string | null;
    level_approval: number;
    pengajuan?: { nomor_pengajuan: string };
    approver?: { name: string };
}

interface Props {
    item: Approval;
    statusOptions: SelectOption[];
    isAdmin: boolean;
}

export default function ApprovalPengajuansEdit({ item, statusOptions, isAdmin }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Persetujuan', href: '/approval-pengajuans' },
        { title: 'Edit', href: route('approval-pengajuans.edit', item.id) },
    ];

    const { data, setData, put, processing, errors } = useForm({
        status: item.status,
        catatan: item.catatan ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('approval-pengajuans.update', item.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Persetujuan" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title="Edit Persetujuan"
                    description={item.pengajuan?.nomor_pengajuan ?? `ID #${item.id}`}
                />

                <FlashAlert />

                {!isAdmin && (
                    <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                        Pengajuan: <span className="font-medium text-foreground">{item.pengajuan?.nomor_pengajuan}</span>
                        {' · '}
                        Approver: <span className="font-medium text-foreground">{item.approver?.name}</span>
                        {' · '}
                        Level: <span className="font-medium text-foreground">{item.level_approval}</span>
                    </div>
                )}

                <FormCard>
                    <form onSubmit={submit} className="space-y-6">
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
                                rows={4}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <InputError message={errors.catatan} />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button type="submit" disabled={processing}>
                                Simpan Perubahan
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={route('approval-pengajuans.show', item.id)}>Batal</Link>
                            </Button>
                        </div>
                    </form>
                </FormCard>
            </div>
        </AppLayout>
    );
}

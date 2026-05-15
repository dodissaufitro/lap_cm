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
}

interface Props {
    pengajuans: Pengajuan[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Lampiran', href: '/lampirans' },
    { title: 'Unggah', href: '/lampirans/create' },
];

export default function LampiransCreate({ pengajuans }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        pengajuan_id: pengajuans[0] ? String(pengajuans[0].id) : '',
        file: null as File | null,
    });

    const pengajuanOptions: SelectOption[] = pengajuans.map((p) => ({
        value: String(p.id),
        label: p.nomor_pengajuan,
    }));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('lampirans.store'), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Unggah Lampiran" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader title="Unggah Lampiran" description="Lampirkan berkas ke pengajuan" />

                <FlashAlert />

                <FormCard>
                    <form onSubmit={submit} className="space-y-6">
                        <FormSelect
                            id="pengajuan_id"
                            label="Pengajuan"
                            value={data.pengajuan_id}
                            onChange={(v) => setData('pengajuan_id', v)}
                            options={pengajuanOptions}
                            placeholder="Pilih pengajuan"
                            error={errors.pengajuan_id}
                        />

                        <div className="grid gap-2">
                            <Label htmlFor="file">Berkas</Label>
                            <Input
                                id="file"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                                required
                            />
                            <p className="text-xs text-muted-foreground">PDF, gambar, atau dokumen Word. Maks. 5 MB.</p>
                            <InputError message={errors.file} />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button type="submit" disabled={processing}>
                                Unggah
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={route('lampirans.index')}>Batal</Link>
                            </Button>
                        </div>
                    </form>
                </FormCard>
            </div>
        </AppLayout>
    );
}

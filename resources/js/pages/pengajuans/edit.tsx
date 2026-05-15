import { FlashAlert } from '@/components/crud/flash-alert';
import { FormCard } from '@/components/crud/form-card';
import { SaranaSelectField } from '@/components/pengajuans/sarana-select-field';
import { FormSelect } from '@/components/crud/form-select';
import { PageHeader } from '@/components/crud/page-header';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { toDateInput, toDatetimeLocal } from '@/lib/datetime';
import { type BreadcrumbItem } from '@/types';
import { type SelectOption } from '@/types/crud';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Pengajuan {
    id: number;
    nomor_pengajuan: string;
    sarana_id: number;
    user_id: number;
    tanggal_pengajuan: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    tujuan_penggunaan: string;
    jumlah_peserta: number | null;
    status: string;
    catatan_admin: string | null;
}

interface Sarana {
    id: number;
    nama_sarana: string;
    kode_sarana: string;
}

interface Pemohon {
    id: number;
    name: string;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
}

interface Props {
    item: Pengajuan & { user?: { id: number; name: string; email: string } };
    saranas: Sarana[];
    users: Pemohon[];
    authUser: AuthUser;
    statusOptions: SelectOption[];
    isAdmin: boolean;
    isPemohon: boolean;
}

const pemohonStatusValues = ['draft', 'diajukan'] as const;

export default function PengajuansEdit({ item, saranas, users, authUser, statusOptions, isAdmin, isPemohon }: Props) {
    const pemohon = item.user ?? authUser;
    const pemohonName = pemohon?.name ?? '—';
    const pemohonEmail = pemohon?.email ?? '—';
    const pemohonStatusOptions = statusOptions.filter((o) =>
        pemohonStatusValues.includes(o.value as (typeof pemohonStatusValues)[number]),
    );
    const pemohonCanChooseStatus = isPemohon && pemohonStatusValues.includes(item.status as (typeof pemohonStatusValues)[number]);
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengajuan', href: '/pengajuans' },
        { title: item.nomor_pengajuan, href: route('pengajuans.show', item.id) },
        { title: 'Edit', href: route('pengajuans.edit', item.id) },
    ];

    const { data, setData, put, processing, errors } = useForm({
        sarana_id: String(item.sarana_id),
        ...(isAdmin ? { user_id: String(item.user_id) } : {}),
        tanggal_pengajuan: toDateInput(item.tanggal_pengajuan),
        tanggal_mulai: toDatetimeLocal(item.tanggal_mulai),
        tanggal_selesai: toDatetimeLocal(item.tanggal_selesai),
        tujuan_penggunaan: item.tujuan_penggunaan,
        jumlah_peserta: item.jumlah_peserta ? String(item.jumlah_peserta) : '',
        status: item.status,
        catatan_admin: item.catatan_admin ?? '',
    });

    const userOptions: SelectOption[] = users.map((u) => ({
        value: String(u.id),
        label: u.name,
    }));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('pengajuans.update', item.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${item.nomor_pengajuan}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader title="Edit Pengajuan" description={item.nomor_pengajuan} />

                <FlashAlert />

                <FormCard>
                    <form onSubmit={submit} className="space-y-6">
                        {isAdmin ? (
                            <FormSelect
                                id="user_id"
                                label="Pemohon"
                                value={data.user_id as string}
                                onChange={(v) => setData('user_id', v)}
                                options={userOptions}
                                error={errors.user_id}
                            />
                        ) : (
                            <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Pemohon</p>
                                <p className="mt-1 font-semibold text-foreground">{pemohonName}</p>
                                <p className="text-sm text-muted-foreground">{pemohonEmail}</p>
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="tanggal_pengajuan">Tanggal Pengajuan</Label>
                            <Input
                                id="tanggal_pengajuan"
                                type="date"
                                value={data.tanggal_pengajuan}
                                onChange={(e) => setData('tanggal_pengajuan', e.target.value)}
                                required
                            />
                            <InputError message={errors.tanggal_pengajuan} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="tanggal_mulai">Mulai</Label>
                                <Input
                                    id="tanggal_mulai"
                                    type="datetime-local"
                                    value={data.tanggal_mulai}
                                    onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                    required
                                />
                                <InputError message={errors.tanggal_mulai} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tanggal_selesai">Selesai</Label>
                                <Input
                                    id="tanggal_selesai"
                                    type="datetime-local"
                                    value={data.tanggal_selesai}
                                    onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                    required
                                />
                                <InputError message={errors.tanggal_selesai} />
                            </div>
                        </div>

                        <SaranaSelectField
                            saranas={saranas}
                            saranaId={data.sarana_id}
                            tanggalMulai={data.tanggal_mulai}
                            tanggalSelesai={data.tanggal_selesai}
                            onSaranaChange={(v) => setData('sarana_id', v)}
                            error={errors.sarana_id}
                            exceptPengajuanId={item.id}
                        />

                        <div className="grid gap-2">
                            <Label htmlFor="tujuan_penggunaan">Tujuan Penggunaan</Label>
                            <textarea
                                id="tujuan_penggunaan"
                                value={data.tujuan_penggunaan}
                                onChange={(e) => setData('tujuan_penggunaan', e.target.value)}
                                rows={4}
                                required
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <InputError message={errors.tujuan_penggunaan} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="jumlah_peserta">Jumlah Peserta</Label>
                            <Input
                                id="jumlah_peserta"
                                type="number"
                                min={1}
                                value={data.jumlah_peserta}
                                onChange={(e) => setData('jumlah_peserta', e.target.value)}
                            />
                            <InputError message={errors.jumlah_peserta} />
                        </div>

                        {isAdmin ? (
                            <FormSelect
                                id="status"
                                label="Status"
                                value={data.status}
                                onChange={(v) => setData('status', v)}
                                options={statusOptions}
                                error={errors.status}
                            />
                        ) : pemohonCanChooseStatus ? (
                            <FormSelect
                                id="status"
                                label="Status"
                                value={data.status}
                                onChange={(v) => setData('status', v)}
                                options={pemohonStatusOptions}
                                error={errors.status}
                            />
                        ) : (
                            <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Status</p>
                                <p className="mt-1 font-semibold capitalize text-foreground">{item.status.replace('_', ' ')}</p>
                                <p className="mt-2 text-xs text-muted-foreground">Status tidak dapat diubah oleh pemohon.</p>
                            </div>
                        )}

                        {isAdmin && (
                            <div className="grid gap-2">
                                <Label htmlFor="catatan_admin">Catatan Admin</Label>
                                <textarea
                                    id="catatan_admin"
                                    value={data.catatan_admin}
                                    onChange={(e) => setData('catatan_admin', e.target.value)}
                                    rows={3}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                                <InputError message={errors.catatan_admin} />
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            <Button type="submit" disabled={processing}>
                                Simpan Perubahan
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={route('pengajuans.show', item.id)}>Batal</Link>
                            </Button>
                        </div>
                    </form>
                </FormCard>
            </div>
        </AppLayout>
    );
}

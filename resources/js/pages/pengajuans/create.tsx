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
import { type BreadcrumbItem } from '@/types';
import { type SelectOption } from '@/types/crud';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

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
    saranas: Sarana[];
    users: Pemohon[];
    authUser: AuthUser;
    statusOptions: SelectOption[];
    isAdmin: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pengajuan', href: '/pengajuans' },
    { title: 'Tambah', href: '/pengajuans/create' },
];

const pemohonStatusValues = ['draft', 'diajukan'] as const;

export default function PengajuansCreate({ saranas, users, authUser, statusOptions, isAdmin }: Props) {
    const today = new Date().toISOString().slice(0, 10);
    const pemohonStatusOptions = statusOptions.filter((o) =>
        pemohonStatusValues.includes(o.value as (typeof pemohonStatusValues)[number]),
    );

    const { data, setData, post, processing, errors } = useForm({
        sarana_id: '',
        ...(isAdmin ? { user_id: users[0] ? String(users[0].id) : '' } : {}),
        tanggal_pengajuan: today,
        tanggal_mulai: '',
        tanggal_selesai: '',
        tujuan_penggunaan: '',
        jumlah_peserta: '',
        status: 'diajukan',
        catatan_admin: '',
    });

    const userOptions: SelectOption[] = users.map((u) => ({
        value: String(u.id),
        label: u.name,
    }));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('pengajuans.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Pengajuan" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader title="Tambah Pengajuan" description="Ajukan penggunaan sarana" />

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
                                placeholder="Pilih pemohon"
                                error={errors.user_id}
                            />
                        ) : (
                            <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Pemohon</p>
                                <p className="mt-1 font-semibold text-foreground">{authUser.name}</p>
                                <p className="text-sm text-muted-foreground">{authUser.email}</p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Pengajuan akan tersimpan atas nama akun Anda.
                                </p>
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

                        <FormSelect
                            id="status"
                            label="Status"
                            value={data.status}
                            onChange={(v) => setData('status', v)}
                            options={isAdmin ? statusOptions : pemohonStatusOptions}
                            error={errors.status}
                        />

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
                                Simpan
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={route('pengajuans.index')}>Batal</Link>
                            </Button>
                        </div>
                    </form>
                </FormCard>
            </div>
        </AppLayout>
    );
}

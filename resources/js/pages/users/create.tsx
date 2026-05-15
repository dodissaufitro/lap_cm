import { FlashAlert } from '@/components/crud/flash-alert';
import { FormCard } from '@/components/crud/form-card';
import { FormSelect } from '@/components/crud/form-select';
import { PageHeader } from '@/components/crud/page-header';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type SelectOption } from '@/types/crud';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    roleOptions: SelectOption[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pengguna', href: '/users' },
    { title: 'Tambah', href: '/users/create' },
];

export default function UsersCreate({ roleOptions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: roleOptions[0]?.value ?? 'pemohon',
        is_active: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Pengguna" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader title="Tambah Pengguna" />

                <FlashAlert />

                <FormCard>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="password">Kata Sandi</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <FormSelect
                            id="role"
                            label="Peran"
                            value={data.role}
                            onChange={(v) => setData('role', v)}
                            options={roleOptions}
                            error={errors.role}
                        />

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', checked === true)}
                            />
                            <Label htmlFor="is_active" className="cursor-pointer font-normal">
                                Akun aktif
                            </Label>
                            <InputError message={errors.is_active} />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button type="submit" disabled={processing}>
                                Simpan
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={route('users.index')}>Batal</Link>
                            </Button>
                        </div>
                    </form>
                </FormCard>
            </div>
        </AppLayout>
    );
}

import { AuthSplitShell } from '@/components/auth/auth-split-shell';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { APP_TITLE } from '@/lib/app-brand';
import { cn } from '@/lib/utils';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Daftar" />

            <AuthSplitShell
                activeTab="register"
                header={
                    <>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Buat Akun Baru</h1>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">
                            Daftar untuk mendapatkan akses ke sistem {APP_TITLE}.
                        </p>
                    </>
                }
            >
                <form className="space-y-5" onSubmit={submit}>
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-slate-800">
                            Nama Lengkap
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Masukkan nama lengkap"
                            className="h-12 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:ring-sky-400/25"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-slate-800">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="nama@perusahaan.com"
                            className="h-12 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:ring-sky-400/25"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-semibold text-slate-800">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Masukkan password"
                            className="h-12 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:ring-sky-400/25"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation" className="text-sm font-semibold text-slate-800">
                            Konfirmasi Password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Ulangi password"
                            className="h-12 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:ring-sky-400/25"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <button
                        type="submit"
                        tabIndex={5}
                        disabled={processing}
                        className={cn(
                            'flex h-12 w-full items-center justify-center rounded-xl bg-[#38bdf8] text-sm font-semibold text-white shadow-md shadow-sky-500/30 transition',
                            'hover:bg-sky-400 active:scale-[0.99] disabled:opacity-70',
                        )}
                    >
                        {processing ? <LoaderCircle className="size-5 animate-spin" /> : 'Daftar Akun'}
                    </button>
                </form>

                <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-relaxed text-slate-600">Sudah punya akun? Masuk ke dashboard.</p>
                    <TextLink
                        href={route('login')}
                        className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white no-underline transition hover:bg-slate-800"
                    >
                        Login
                    </TextLink>
                </div>
            </AuthSplitShell>
        </>
    );
}

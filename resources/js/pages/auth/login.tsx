import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, Lock, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

import { APP_TITLE, useAppLogoUrl } from '@/lib/app-brand';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { type DemoUser } from '@/types';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    demoUsers?: DemoUser[];
}

const roleBadgeClass: Record<DemoUser['role'], string> = {
    admin: 'border-rose-400/40 bg-rose-500/15 text-rose-200',
    approver: 'border-sky-400/40 bg-sky-500/15 text-sky-200',
    pemohon: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200',
};

export default function Login({ status, canResetPassword, demoUsers = [] }: LoginProps) {
    const logoUrl = useAppLogoUrl();
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const fillDemoAccount = (account: DemoUser) => {
        setData({
            email: account.email,
            password: account.password,
            remember: false,
        });
    };

    return (
        <>
            <Head title="Masuk" />

            <div className="relative flex min-h-svh items-center justify-center bg-[#050816] px-4 py-12 sm:px-6">
                {/* Background gradient & ambient light */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(212,175,55,0.22),transparent_55%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,#050816_0%,#0f172a_45%,#1e293b_100%)]" />

                {/* Soft orbs */}
                <div className="pointer-events-none absolute -top-24 -left-16 size-64 rounded-full bg-amber-400/15 blur-3xl sm:size-80" />
                <div className="pointer-events-none absolute -right-20 -bottom-28 size-72 rounded-full bg-white/5 blur-3xl sm:size-96" />

                {/* 3D decorative cubes */}
                <div
                    aria-hidden
                    className="login-float login-perspective pointer-events-none absolute top-[12%] right-[8%] hidden size-20 rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] sm:block"
                    style={{ transform: 'rotateX(55deg) rotateZ(35deg)' }}
                />
                <div
                    aria-hidden
                    className="login-float-delayed login-perspective pointer-events-none absolute bottom-[18%] left-[6%] hidden size-14 rounded-xl border border-amber-400/20 bg-amber-400/10 shadow-lg sm:block"
                    style={{ transform: 'rotateX(55deg) rotateZ(20deg)' }}
                />
                <div
                    aria-hidden
                    className="login-shimmer pointer-events-none absolute top-[22%] left-[12%] hidden size-3 rounded-full bg-amber-300/80 sm:block"
                />

                <div className="login-perspective relative z-10 w-full max-w-md">
                    {/* Card glow */}
                    <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-amber-500/25 via-transparent to-amber-600/10 blur-xl" />

                    <div
                        className={cn(
                            'login-card-3d relative overflow-hidden rounded-[1.75rem] border border-white/15',
                            'bg-white/[0.07] p-8 shadow-[0_25px_60px_-15px_rgba(212,175,55,0.35),0_0_0_1px_rgba(255,255,255,0.05)_inset]',
                            'backdrop-blur-xl sm:p-10',
                        )}
                    >
                        {/* Inner highlight */}
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                        {/* Header */}
                        <div className="mb-8 text-center">
                            <Link
                                href={route('home')}
                                className="mb-5 inline-flex flex-col items-center gap-2 transition hover:opacity-90"
                            >
                                <img
                                    src={logoUrl}
                                    alt={APP_TITLE}
                                    className="h-16 w-auto object-contain sm:h-20"
                                />
                            </Link>
                            <h1 className="font-display text-3xl font-semibold tracking-wide text-white sm:text-4xl">
                                {APP_TITLE}
                            </h1>
                            <p className="font-formal mt-3 text-sm leading-relaxed text-slate-300/90">
                                Masuk ke akun Anda untuk melanjutkan
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center font-formal text-sm text-emerald-200">
                                {status}
                            </div>
                        )}

                        {demoUsers.length > 0 && (
                            <div className="mb-6 space-y-3">
                                <p className="text-center font-formal text-xs tracking-wide text-slate-400 uppercase">
                                    Akun demo — pilih peran
                                </p>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {demoUsers.map((account) => (
                                        <button
                                            key={account.email}
                                            type="button"
                                            disabled={processing}
                                            onClick={() => fillDemoAccount(account)}
                                            className={cn(
                                                'rounded-xl border border-white/10 bg-white/[0.05] p-3 text-left transition',
                                                'hover:border-amber-400/35 hover:bg-white/[0.09]',
                                                'disabled:cursor-not-allowed disabled:opacity-60',
                                                data.email === account.email && 'border-amber-400/50 ring-1 ring-amber-400/30',
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'mb-2 inline-block rounded-full border px-2 py-0.5 font-formal text-[10px] font-medium tracking-wide uppercase',
                                                    roleBadgeClass[account.role],
                                                )}
                                            >
                                                {account.label}
                                            </span>
                                            <span className="block font-formal text-sm font-medium text-white">{account.name}</span>
                                            <span className="mt-0.5 block truncate font-formal text-xs text-slate-400">{account.email}</span>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-center font-formal text-[11px] text-slate-500">
                                    Kata sandi semua akun demo: <span className="text-amber-400/90">password</span>
                                </p>
                            </div>
                        )}

                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="font-formal text-slate-200">
                                        Alamat Email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-amber-400/90" />
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={processing}
                                            placeholder="nama@perusahaan.com"
                                            className="h-12 border-white/10 bg-white/[0.06] pl-11 font-formal text-white placeholder:text-slate-500 focus-visible:border-amber-400/40 focus-visible:ring-amber-400/25"
                                        />
                                    </div>
                                    <InputError message={errors.email} className="text-amber-200/90" />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <Label htmlFor="password" className="font-formal text-slate-200">
                                            Kata Sandi
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={route('password.request')}
                                                className="font-formal text-xs text-amber-400/90 no-underline hover:text-amber-300"
                                                tabIndex={5}
                                            >
                                                Lupa kata sandi?
                                            </TextLink>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-amber-400/90" />
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            disabled={processing}
                                            placeholder="••••••••"
                                            className="h-12 border-white/10 bg-white/[0.06] pl-11 font-formal text-white placeholder:text-slate-500 focus-visible:border-amber-400/40 focus-visible:ring-amber-400/25"
                                        />
                                    </div>
                                    <InputError message={errors.password} className="text-amber-200/90" />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        checked={data.remember}
                                        onCheckedChange={(checked) => setData('remember', checked === true)}
                                        className="border-white/20 bg-white/5 data-[state=checked]:border-amber-400 data-[state=checked]:bg-amber-500"
                                    />
                                    <Label htmlFor="remember" className="cursor-pointer font-formal text-sm font-normal text-slate-300">
                                        Ingat saya
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    tabIndex={4}
                                    disabled={processing}
                                    className={cn(
                                        'mt-1 h-12 w-full rounded-xl border-0 font-display text-base font-semibold tracking-[0.2em] uppercase',
                                        'bg-gradient-to-br from-[#d4af37] via-[#f5d061] to-[#b8860b] text-slate-900',
                                        'shadow-[0_12px_32px_-8px_rgba(212,175,55,0.55)] transition-all duration-300',
                                        'hover:scale-[1.02] hover:shadow-[0_16px_40px_-8px_rgba(212,175,55,0.65)]',
                                        'active:scale-[0.98] disabled:opacity-70',
                                    )}
                                >
                                    {processing ? (
                                        <LoaderCircle className="size-5 animate-spin" />
                                    ) : (
                                        'Masuk'
                                    )}
                                </Button>
                            </div>

                            <div className="text-center font-formal text-sm text-slate-400">
                                Belum punya akun?{' '}
                                <TextLink
                                    href={route('register')}
                                    tabIndex={6}
                                    className="font-medium text-amber-400/95 no-underline hover:text-amber-300"
                                >
                                    Daftar sekarang
                                </TextLink>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

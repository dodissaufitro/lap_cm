import { AuthSplitShell } from '@/components/auth/auth-split-shell';
import { DemoAccountsPanel } from '@/components/auth/demo-accounts-panel';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { APP_SHORT_NAME } from '@/lib/app-brand';
import { cn } from '@/lib/utils';
import { type DemoUser } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

export default function Login({ status, canResetPassword, demoUsers = [] }: LoginProps) {
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

            <AuthSplitShell
                activeTab="login"
                header={
                    <>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">
                            Login untuk mengakses dashboard dan layanan sistem {APP_SHORT_NAME}.
                        </p>
                    </>
                }
            >
                {status && (
                    <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        {status}
                    </div>
                )}

                <form className="space-y-5" onSubmit={submit}>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-slate-800">
                            Username / Email
                        </Label>
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
                            placeholder="Masukkan username atau email"
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
                            name="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Masukkan password"
                            className="h-12 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:ring-sky-400/25"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="remember"
                                name="remember"
                                tabIndex={3}
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', checked === true)}
                                className="border-slate-300 data-[state=checked]:border-sky-500 data-[state=checked]:bg-sky-500"
                            />
                            <Label htmlFor="remember" className="cursor-pointer text-sm font-normal text-slate-600">
                                Remember me
                            </Label>
                        </div>
                        {canResetPassword && (
                            <TextLink
                                href={route('password.request')}
                                className="shrink-0 text-sm font-medium text-sky-500 no-underline hover:text-sky-600"
                                tabIndex={5}
                            >
                                Forgot Password?
                            </TextLink>
                        )}
                    </div>

                    <button
                        type="submit"
                        tabIndex={4}
                        disabled={processing}
                        className={cn(
                            'flex h-12 w-full items-center justify-center rounded-xl bg-[#38bdf8] text-sm font-semibold text-white shadow-md shadow-sky-500/30 transition',
                            'hover:bg-sky-400 active:scale-[0.99] disabled:opacity-70',
                        )}
                    >
                        {processing ? <LoaderCircle className="size-5 animate-spin" /> : 'Login to Dashboard'}
                    </button>

                    <DemoAccountsPanel
                        accounts={demoUsers}
                        selectedEmail={data.email}
                        disabled={processing}
                        onSelect={fillDemoAccount}
                    />
                </form>

                <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-relaxed text-slate-600">
                        Belum punya akun? Daftarkan akun baru untuk mendapatkan akses ke sistem.
                    </p>
                    <Link
                        href={route('register')}
                       
                        className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        Daftar
                    </Link>
                </div>
            </AuthSplitShell>
        </>
    );
}

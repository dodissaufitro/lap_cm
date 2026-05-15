import { AuthBrandPanel } from '@/components/auth/auth-brand-panel';
import { APP_TITLE, useAppLogoUrl } from '@/lib/app-brand';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface AuthSplitShellProps {
    activeTab: 'login' | 'register';
    header: ReactNode;
    children: ReactNode;
}

export function AuthSplitShell({ activeTab, header, children }: AuthSplitShellProps) {
    const logoUrl = useAppLogoUrl();
    const year = new Date().getFullYear();

    return (
        <div className="flex min-h-svh flex-col bg-white lg:flex-row">
            <AuthBrandPanel />

            <div className="flex flex-1 flex-col lg:justify-center">
                <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8 sm:max-w-lg sm:px-10 md:max-w-xl lg:max-h-svh lg:max-w-2xl lg:flex-initial lg:overflow-y-auto lg:px-14 lg:py-12 xl:px-16">
                    <div className="mb-6 flex items-center gap-3 lg:hidden">
                        {logoUrl ? (
                            <img src={logoUrl} alt={APP_TITLE} className="h-10 w-auto object-contain" />
                        ) : (
                            <div className="flex size-10 items-center justify-center rounded-xl bg-[#38bdf8] text-sm font-bold text-white">
                                TCH
                            </div>
                        )}
                        <span className="text-sm font-semibold text-slate-900">{APP_TITLE}</span>
                    </div>

                    <header className="mb-6">{header}</header>

                    <div className="mb-8 flex rounded-full bg-slate-100 p-1">
                        <Link
                            href={route('login')}
                            prefetch
                            className={cn(
                                'flex flex-1 items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition',
                                activeTab === 'login'
                                    ? 'bg-[#38bdf8] text-white shadow-sm shadow-sky-500/30'
                                    : 'text-slate-500 hover:text-slate-700',
                            )}
                        >
                            Login
                        </Link>
                        <Link
                            href={route('register')}
                            prefetch
                            className={cn(
                                'flex flex-1 items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition',
                                activeTab === 'register'
                                    ? 'bg-[#38bdf8] text-white shadow-sm shadow-sky-500/30'
                                    : 'text-slate-500 hover:text-slate-700',
                            )}
                        >
                            Daftar
                        </Link>
                    </div>

                    <div className="flex flex-1 flex-col">{children}</div>

                    <p className="mt-auto pt-8 text-center text-xs text-slate-400">
                        &copy; {year} {APP_TITLE}
                    </p>
                </div>
            </div>
        </div>
    );
}

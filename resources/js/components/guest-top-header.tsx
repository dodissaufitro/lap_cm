import AppLogo from '@/components/app-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { LogIn } from 'lucide-react';

export function GuestTopHeader() {
    return (
        <header className={cn('safe-x relative z-20 w-full shrink-0 border-b hub-glass-header')}>
            <div className="flex h-14 w-full items-center justify-between gap-3 sm:h-16 lg:h-[4.5rem]">
                <Link href={route('home')} className="flex min-w-0 flex-1 items-center gap-3 lg:gap-4">
                    <AppLogo imageClassName="h-8 sm:h-9 lg:h-11 xl:h-12" />
                </Link>

                <div className="flex shrink-0 items-center gap-2">
                    <ThemeToggle />
                    <Link
                        href={route('login')}
                       
                        className="inline-flex items-center gap-2 rounded-xl bg-[#38bdf8] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/25 transition hover:bg-sky-400 sm:px-5"
                    >
                        <LogIn className="size-4" />
                        <span className="hidden sm:inline">Masuk</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}

import { mainNavItems } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { type NavItem, type SharedData } from '@/types';
import { type MenuCountEntry, type MenuCounts } from '@/types/dashboard';
import { Link, usePage } from '@inertiajs/react';
import { CircleCheck, LogIn, Sparkles, type LucideIcon } from 'lucide-react';

interface NavMenuCardsProps {
    items?: NavItem[];
    className?: string;
    fillScreen?: boolean;
    /** Halaman beranda tamu: semua modul mengarah ke login, tanpa hitungan data. */
    guestMode?: boolean;
}

function RingGradients() {
    return (
        <svg width="0" height="0" className="pointer-events-none absolute overflow-hidden" aria-hidden>
            <defs>
                <linearGradient id="hub-ring-gradient-neon" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#ff0080" />
                    <stop offset="50%" stopColor="#7928ca" />
                    <stop offset="100%" stopColor="#0070f3" />
                </linearGradient>
                <linearGradient id="hub-ring-gradient-blue" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#0070f3" />
                    <stop offset="100%" stopColor="#00c6ff" />
                </linearGradient>
                <linearGradient id="hub-ring-gradient-gold" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#f5a623" />
                    <stop offset="100%" stopColor="#ff0080" />
                </linearGradient>
                <linearGradient id="hub-ring-gradient-mint" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#00dfd8" />
                    <stop offset="100%" stopColor="#7928ca" />
                </linearGradient>
                <linearGradient id="hub-ring-gradient-violet" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <linearGradient id="hub-ring-gradient-cyan" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <linearGradient id="hub-ring-gradient-sunset" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#fb923c" />
                    <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
                <linearGradient id="hub-ring-gradient-default" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#ff0080" />
                    <stop offset="100%" stopColor="#7928ca" />
                </linearGradient>
            </defs>
        </svg>
    );
}

function MenuIconRing({ Icon, ringClass, size = 'default' }: { Icon: LucideIcon; ringClass: string; size?: 'default' | 'sm' }) {
    return (
        <div className={cn('hub-glass-ring shrink-0', ringClass, size === 'sm' && 'hub-glass-ring-sm')}>
            <svg className="hub-glass-ring-svg" viewBox="0 0 64 64" aria-hidden>
                <circle className="hub-glass-ring-track" cx="32" cy="32" r="27" fill="none" strokeWidth="3.5" />
                <circle className="hub-glass-ring-progress" cx="32" cy="32" r="27" fill="none" strokeWidth="3.5" />
            </svg>
            <div className="hub-glass-ring-inner">
                <Icon
                    className={cn(
                        'text-foreground dark:text-white',
                        size === 'sm' ? 'size-5 sm:size-6' : 'size-7 sm:size-8 lg:size-9',
                    )}
                    strokeWidth={1.75}
                    aria-hidden
                />
            </div>
        </div>
    );
}

function CardTotal({ count, align = 'center' }: { count: MenuCountEntry; align?: 'center' | 'end' }) {
    return (
        <div
            className={cn(
                'hub-glass-card-total w-full border-t border-slate-200 pt-2.5 dark:border-white/10',
                align === 'center' && 'text-center',
                align === 'end' && 'text-right',
            )}
        >
            <p className="text-xl font-bold leading-none tabular-nums text-foreground sm:text-2xl lg:text-[1.75rem]">
                {count.total.toLocaleString('id-ID')}
            </p>
            <p className="mt-1.5 text-xs capitalize text-muted-foreground sm:text-sm">{count.label}</p>
        </div>
    );
}

function WelcomeGuestBanner() {
    return (
        <div className="hub-glass-card hub-glass-card-featured hub-status-banner w-full shrink-0 p-5 sm:p-6 lg:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-5">
                    <MenuIconRing Icon={Sparkles} ringClass="hub-ring-neon" size="sm" />
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase sm:text-xs">
                            Tanah Datar Creatif HUB
                        </p>
                        <p className="mt-1 text-lg font-semibold leading-tight text-foreground sm:text-xl lg:text-2xl">
                            Sistem Pengajuan Sarana &amp; Prasarana
                        </p>
                        <p className="mt-1.5 text-sm leading-snug text-muted-foreground sm:text-base">
                            Masuk untuk mengelola pengajuan, sarana, jadwal, dan modul lainnya.
                        </p>
                    </div>
                </div>
                <Link
                    href={route('login')}
                    prefetch
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#38bdf8] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-sky-500/30 transition hover:bg-sky-400"
                >
                    <LogIn className="size-4" />
                    Masuk ke Dashboard
                </Link>
            </div>
        </div>
    );
}

function StatusBanner({ count }: { count?: MenuCountEntry }) {
    return (
        <div className="hub-glass-card hub-glass-card-featured hub-status-banner w-full shrink-0 p-5 sm:p-6 lg:p-7">
            <div className="flex items-start gap-3 sm:items-center sm:gap-5">
                <MenuIconRing Icon={CircleCheck} ringClass="hub-ring-mint" size="sm" />
                <div className="min-w-0 flex-1 pt-0.5">
                    <p className="hub-status-banner-label">Status Sistem</p>
                    <p className="hub-status-banner-title mt-1">Siap Digunakan</p>
                    <p className="hub-status-banner-desc mt-1.5">Pilih modul di bawah untuk mulai</p>
                </div>
                {count && (
                    <div className="hidden shrink-0 border-l border-slate-200 pl-4 text-right sm:block sm:pl-5 dark:border-white/10">
                        <p className="text-xl font-bold leading-none tabular-nums text-slate-900 sm:text-2xl dark:text-white">
                            {count.total.toLocaleString('id-ID')}
                        </p>
                        <p className="mt-1 text-[11px] capitalize text-slate-600 sm:text-xs dark:text-slate-300">{count.label}</p>
                    </div>
                )}
            </div>
            {count && (
                <div className="hub-status-banner-stat mt-3 flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/90 px-3 py-2.5 sm:hidden dark:border-white/10 dark:bg-white/[0.04]">
                    <span className="shrink-0 text-[10px] font-medium tracking-wide text-slate-600 uppercase dark:text-slate-300">Total</span>
                    <div className="min-w-0 text-right">
                        <p className="text-lg font-bold leading-none tabular-nums text-slate-900 dark:text-white">
                            {count.total.toLocaleString('id-ID')}
                        </p>
                        <p className="mt-0.5 text-[11px] capitalize text-slate-600 dark:text-slate-300">{count.label}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function MenuGridCard({
    title,
    description,
    count,
    href,
    Icon,
    ringClass,
    isActive,
}: {
    title: string;
    description?: string;
    count?: MenuCountEntry;
    href: string;
    Icon: LucideIcon;
    ringClass: string;
    isActive?: boolean;
}) {
    return (
        <Link
            href={href}
            prefetch
            className={cn(
                'hub-glass-card hub-glass-card-interactive flex min-h-[12rem] flex-col items-center gap-4 p-5 sm:min-h-[13rem] sm:gap-4 sm:p-6 md:min-h-[13.5rem] lg:min-h-[14.5rem] lg:gap-5 lg:p-7 xl:min-h-[15.5rem]',
                isActive && 'hub-glass-card-active',
            )}
        >
            <MenuIconRing Icon={Icon} ringClass={ringClass} />
            <div className="w-full px-1 text-center">
                <p className="line-clamp-2 text-base font-semibold leading-snug text-foreground sm:text-lg lg:text-xl">{title}</p>
                {description ? (
                    <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground sm:text-sm">{description}</p>
                ) : null}
            </div>
            {count ? (
                <div className="mt-auto w-full">
                    <CardTotal count={count} />
                </div>
            ) : (
                <div className="mt-auto" aria-hidden />
            )}
        </Link>
    );
}

export function NavMenuCards({ items = mainNavItems, className, fillScreen = false, guestMode = false }: NavMenuCardsProps) {
    const page = usePage<SharedData & { menuCounts?: MenuCounts }>();
    const role = page.props.auth?.user?.role;
    const menuCounts = page.props.menuCounts ?? {};

    const visibleItems = items.filter((item) => {
        if (item.url === '/dashboard') {
            return false;
        }

        if (guestMode) {
            return true;
        }

        if (!item.roles?.length) {
            return true;
        }

        return role ? item.roles.includes(role) : false;
    });

    return (
        <nav
            className={cn(
                'relative z-10 flex w-full min-w-0 flex-col gap-4 sm:gap-6',
                fillScreen && 'mx-auto min-h-0 w-full max-w-6xl flex-1 lg:max-w-7xl 2xl:max-w-[90rem]',
                className,
            )}
            aria-label="Menu utama"
        >
            <RingGradients />

            {fillScreen && (guestMode ? <WelcomeGuestBanner /> : <StatusBanner count={menuCounts['/dashboard']} />)}

            <div className="flex min-h-0 flex-1 flex-col gap-4 sm:gap-5 lg:gap-6">
                <div className="flex items-center justify-between gap-3 px-0.5">
                    <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase sm:text-base">
                        {guestMode ? 'Modul Sistem' : 'Menu Utama'}
                    </h2>
                    <span className="text-xs text-muted-foreground sm:text-sm">
                        {visibleItems.length} modul{guestMode ? ' — masuk untuk akses' : ''}
                    </span>
                </div>

                <div
                    className={cn(
                        'grid w-full grid-cols-1 gap-4 min-[380px]:grid-cols-2',
                        'sm:gap-5 md:grid-cols-2 md:gap-6',
                        'lg:grid-cols-3 lg:gap-6',
                        'xl:gap-7 2xl:grid-cols-4 2xl:gap-8',
                    )}
                >
                    {visibleItems.map((item) => {
                        const isCurrentPage = page.url.startsWith(item.url);
                        const isActive = isCurrentPage && item.url !== '/dashboard';
                        const Icon = item.icon;

                        if (!Icon) {
                            return null;
                        }

                        return (
                            <MenuGridCard
                                key={item.url}
                                href={guestMode ? route('login') : item.url}
                                title={item.title}
                                description={guestMode ? item.description : undefined}
                                count={guestMode ? undefined : menuCounts[item.url]}
                                Icon={Icon}
                                ringClass={item.ring ?? 'hub-ring-neon'}
                                isActive={!guestMode && isActive}
                            />
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}

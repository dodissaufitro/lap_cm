import { mainNavItems } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { type NavItem, type SharedData } from '@/types';
import { type MenuCountEntry, type MenuCounts } from '@/types/dashboard';
import { Link, usePage } from '@inertiajs/react';
import { Sparkles, type LucideIcon } from 'lucide-react';

interface NavMenuCardsProps {
    items?: NavItem[];
    className?: string;
    fillScreen?: boolean;
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
                    className={cn('text-foreground dark:text-white', size === 'sm' ? 'size-5' : 'size-6 sm:size-7')}
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
                'hub-glass-card-total w-full border-t border-white/10 pt-2.5 dark:border-white/10',
                align === 'center' && 'text-center',
                align === 'end' && 'text-right',
            )}
        >
            <p className="text-lg font-bold leading-none tabular-nums text-foreground sm:text-xl">{count.total.toLocaleString('id-ID')}</p>
            <p className="mt-1 text-[11px] capitalize text-muted-foreground sm:text-xs">{count.label}</p>
        </div>
    );
}

function StatusBanner({ count }: { count?: MenuCountEntry }) {
    return (
        <div className="hub-glass-card hub-glass-card-featured hub-status-banner w-full shrink-0 p-3.5 sm:p-5">
            <div className="flex items-start gap-3 sm:items-center sm:gap-5">
                <MenuIconRing Icon={Sparkles} ringClass="hub-ring-neon" size="sm" />
                <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase sm:text-xs">
                        Status Sistem
                    </p>
                    <p className="mt-1 text-base font-semibold leading-tight text-foreground sm:mt-0.5 sm:text-lg">
                        Siap Digunakan
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground sm:text-sm">
                        Pilih modul di bawah untuk mulai
                    </p>
                </div>
                {count && (
                    <div className="hidden shrink-0 border-l border-white/10 pl-4 text-right sm:block sm:pl-5">
                        <p className="text-xl font-bold leading-none tabular-nums text-foreground sm:text-2xl">
                            {count.total.toLocaleString('id-ID')}
                        </p>
                        <p className="mt-1 text-[11px] capitalize text-muted-foreground sm:text-xs">{count.label}</p>
                    </div>
                )}
            </div>
            {count && (
                <div className="hub-status-banner-stat mt-3 flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 sm:hidden dark:bg-white/[0.04]">
                    <span className="shrink-0 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">Total</span>
                    <div className="min-w-0 text-right">
                        <p className="text-lg font-bold leading-none tabular-nums text-foreground">
                            {count.total.toLocaleString('id-ID')}
                        </p>
                        <p className="mt-0.5 text-[11px] capitalize text-muted-foreground">{count.label}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function MenuGridCard({
    title,
    count,
    href,
    Icon,
    ringClass,
    isActive,
}: {
    title: string;
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
                'hub-glass-card hub-glass-card-interactive flex min-h-[10.25rem] flex-col items-center gap-3 p-4 sm:min-h-[10.75rem] sm:gap-3.5 sm:p-5',
                isActive && 'hub-glass-card-active',
            )}
        >
            <MenuIconRing Icon={Icon} ringClass={ringClass} />
            <p className="line-clamp-2 w-full px-0.5 text-center text-sm font-semibold leading-snug text-foreground sm:text-base">{title}</p>
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

export function NavMenuCards({ items = mainNavItems, className, fillScreen = false }: NavMenuCardsProps) {
    const page = usePage<SharedData & { menuCounts?: MenuCounts }>();
    const role = page.props.auth.user.role;
    const menuCounts = page.props.menuCounts ?? {};

    const visibleItems = items.filter((item) => {
        if (fillScreen && item.url === '/dashboard') {
            return false;
        }

        if (!item.roles?.length) {
            return true;
        }

        return item.roles.includes(role);
    });

    return (
        <nav
            className={cn(
                'relative z-10 flex w-full min-w-0 flex-col gap-4 sm:gap-6',
                fillScreen && 'mx-auto min-h-0 w-full max-w-6xl flex-1 lg:max-w-7xl xl:max-w-5xl',
                className,
            )}
            aria-label="Menu utama"
        >
            <RingGradients />

            {fillScreen && <StatusBanner count={menuCounts['/dashboard']} />}

            <div className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-4">
                <div className="flex items-center justify-between gap-3 px-0.5">
                    <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase sm:text-sm">Menu Utama</h2>
                    <span className="text-[10px] text-muted-foreground sm:text-xs">{visibleItems.length} modul</span>
                </div>

                <div
                    className={cn(
                        'grid w-full grid-cols-2 gap-3 sm:gap-4',
                        'md:grid-cols-3 md:gap-4',
                        'lg:gap-5',
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
                                href={item.url}
                                title={item.title}
                                count={menuCounts[item.url]}
                                Icon={Icon}
                                ringClass={item.ring ?? 'hub-ring-neon'}
                                isActive={isActive}
                            />
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}

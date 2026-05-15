import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { LogIn, LogOut, type LucideIcon } from 'lucide-react';

interface ProsesCounts {
    checkIn: number;
    checkOut: number;
}

function MenuIconRing({ Icon, ringClass }: { Icon: LucideIcon; ringClass: string }) {
    return (
        <div className={cn('hub-glass-ring shrink-0', ringClass)}>
            <svg className="hub-glass-ring-svg" viewBox="0 0 64 64" aria-hidden>
                <circle className="hub-glass-ring-track" cx="32" cy="32" r="27" fill="none" strokeWidth="3.5" />
                <circle className="hub-glass-ring-progress" cx="32" cy="32" r="27" fill="none" strokeWidth="3.5" />
            </svg>
            <div className="hub-glass-ring-inner">
                <Icon className="size-7 text-foreground sm:size-8 lg:size-9" strokeWidth={1.75} aria-hidden />
            </div>
        </div>
    );
}

function ProsesGridCard({
    title,
    description,
    total,
    label,
    href,
    Icon,
    ringClass,
}: {
    title: string;
    description: string;
    total: number;
    label: string;
    href: string;
    Icon: LucideIcon;
    ringClass: string;
}) {
    return (
        <Link
            href={href}
            prefetch
            className="hub-glass-card hub-glass-card-interactive flex min-h-[12rem] flex-col items-center gap-4 p-5 sm:min-h-[13rem] sm:p-6 lg:min-h-[14.5rem] lg:p-7"
        >
            <MenuIconRing Icon={Icon} ringClass={ringClass} />
            <div className="w-full px-1 text-center">
                <p className="text-base font-semibold text-foreground sm:text-lg lg:text-xl">{title}</p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{description}</p>
            </div>
            <div className="hub-glass-card-total mt-auto w-full border-t border-slate-200 pt-2.5 text-center dark:border-white/10">
                <p className="text-xl font-bold tabular-nums text-foreground sm:text-2xl">{total.toLocaleString('id-ID')}</p>
                <p className="mt-1.5 text-xs capitalize text-muted-foreground sm:text-sm">{label}</p>
            </div>
        </Link>
    );
}

export function ProsesMenuCards({ counts }: { counts: ProsesCounts }) {
    return (
        <nav className="mx-auto flex w-full max-w-3xl flex-col gap-5" aria-label="Menu proses">
            <div className="px-0.5">
                <h1 className="text-xl font-bold text-foreground sm:text-2xl">Proses</h1>
                <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                    Check in saat mulai memakai sarana, check out saat selesai.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 min-[380px]:grid-cols-2 sm:gap-5">
                <ProsesGridCard
                    title="Check In"
                    description="Aktif pada tanggal mulai acara"
                    total={counts.checkIn}
                    label="menunggu check in"
                    href="/proses/check-in"
                    Icon={LogIn}
                    ringClass="hub-ring-mint"
                />
                <ProsesGridCard
                    title="Check Out"
                    description="Sudah check in, siap selesai"
                    total={counts.checkOut}
                    label="menunggu check out"
                    href="/proses/check-out"
                    Icon={LogOut}
                    ringClass="hub-ring-sunset"
                />
            </div>
        </nav>
    );
}

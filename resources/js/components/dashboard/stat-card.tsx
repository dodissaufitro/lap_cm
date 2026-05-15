import { type DashboardStat } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { Building2, Calendar, CheckCircle2, Clock, FileText, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<DashboardStat['icon'], LucideIcon> = {
    building: Building2,
    calendar: Calendar,
    check: CheckCircle2,
    x: XCircle,
    clock: Clock,
    file: FileText,
};

const iconColors: Record<DashboardStat['icon'], string> = {
    building: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
    calendar: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
    check: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    x: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    clock: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    file: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

interface StatCardProps {
    stat: DashboardStat;
}

export function StatCard({ stat }: StatCardProps) {
    const Icon = iconMap[stat.icon];

    return (
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <p className="truncate text-sm text-muted-foreground">{stat.title}</p>
                    <p className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{stat.value}</p>
                </div>
                <div
                    className={cn(
                        'flex size-12 shrink-0 items-center justify-center rounded-xl sm:size-14',
                        iconColors[stat.icon],
                    )}
                >
                    <Icon className="size-6 sm:size-7" />
                </div>
            </div>
        </div>
    );
}

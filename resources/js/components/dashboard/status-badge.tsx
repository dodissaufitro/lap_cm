import { cn } from '@/lib/utils';

const pengajuanStyles: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    diajukan: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    diproses: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
    disetujui: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    ditolak: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
    selesai: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
    dibatalkan: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const saranaStyles: Record<string, string> = {
    tersedia: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
    maintenance: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
    tidak_aktif: 'bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300',
};

interface StatusBadgeProps {
    status: string;
    label: string;
    variant?: 'pengajuan' | 'sarana';
    className?: string;
}

export function StatusBadge({ status, label, variant = 'pengajuan', className }: StatusBadgeProps) {
    const styles = variant === 'sarana' ? saranaStyles : pengajuanStyles;

    return (
        <span
            className={cn(
                'inline-flex rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap',
                styles[status] ?? pengajuanStyles.diajukan,
                className,
            )}
        >
            {label}
        </span>
    );
}

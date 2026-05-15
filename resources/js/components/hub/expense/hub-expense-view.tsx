import { FlashAlert } from '@/components/crud/flash-alert';
import { PaginationLinks } from '@/components/crud/pagination-links';
import { type HubExpenseListItem, type HubExpenseViewProps } from '@/types/hub-expense';
import { cn } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { ChevronLeft, Pencil, PieChart, Plus, Trash2 } from 'lucide-react';

function HubExpenseDonut({ value, emoji }: { value: string; emoji: string }) {
    return (
        <div className="hub-expense-donut relative mx-auto flex size-[220px] items-center justify-center sm:size-[240px] lg:size-[260px] xl:size-[280px]">
            <svg className="size-full -rotate-90" viewBox="0 0 200 200" aria-hidden>
                <defs>
                    <linearGradient id="hub-expense-donut-gradient" x1="0%" x2="100%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#f0a1b0" />
                        <stop offset="45%" stopColor="#c77dff" />
                        <stop offset="100%" stopColor="#3d4f7c" />
                    </linearGradient>
                </defs>
                <circle
                    cx="100"
                    cy="100"
                    r="78"
                    fill="none"
                    className="stroke-slate-200 dark:stroke-white/10"
                    strokeWidth="22"
                />
                <circle
                    cx="100"
                    cy="100"
                    r="78"
                    fill="none"
                    stroke="url(#hub-expense-donut-gradient)"
                    strokeWidth="22"
                    strokeLinecap="round"
                    strokeDasharray="360 490"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <span className="text-3xl leading-none lg:text-4xl" aria-hidden>
                    {emoji}
                </span>
                <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-[2.75rem] lg:text-5xl">{value}</p>
            </div>
        </div>
    );
}

function HubExpenseRowActions({
    editHref,
    deleteHref,
    actionHref,
    actionLabel,
    actionDisabled,
    actionDisabledReason,
    ticketHref,
    ticketLabel,
}: {
    editHref?: string;
    deleteHref?: string;
    actionHref?: string;
    actionLabel?: string;
    actionDisabled?: boolean;
    actionDisabledReason?: string;
    ticketHref?: string;
    ticketLabel?: string;
}) {
    if (!editHref && !deleteHref && !actionHref && !ticketHref) {
        return null;
    }

    const handleDelete = () => {
        if (!deleteHref) {
            return;
        }

        if (confirm('Yakin ingin menghapus data ini?')) {
            router.delete(deleteHref);
        }
    };

    return (
        <div className="relative z-10 flex shrink-0 items-center gap-1.5">
            {ticketHref && (
                <a
                    href={ticketHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hub-expense-action-btn hub-expense-action-primary hub-expense-action-label"
                    onClick={(e) => e.stopPropagation()}
                >
                    {ticketLabel ?? 'Cetak Tiket'}
                </a>
            )}
            {actionHref &&
                (actionDisabled ? (
                    <button
                        type="button"
                        disabled
                        title={actionDisabledReason}
                        className="hub-expense-action-btn hub-expense-action-primary hub-expense-action-label hub-expense-action-disabled"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {actionLabel ?? 'Proses'}
                    </button>
                ) : (
                    <Link
                        href={actionHref}
                        method="post"
                        as="button"
                        type="button"
                        preserveScroll
                        className="hub-expense-action-btn hub-expense-action-primary hub-expense-action-label"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!confirm(`Yakin ingin ${actionLabel?.toLowerCase() ?? 'melanjutkan'}?`)) {
                                e.preventDefault();
                            }
                        }}
                    >
                        {actionLabel ?? 'Proses'}
                    </Link>
                ))}
            {editHref && (
                <Link
                    href={editHref}
                    prefetch
                    className="hub-expense-action-btn hub-expense-action-edit"
                    aria-label="Edit"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Pencil className="size-4" />
                </Link>
            )}
            {deleteHref && (
                <button
                    type="button"
                    className="hub-expense-action-btn hub-expense-action-delete"
                    aria-label="Hapus"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                    }}
                >
                    <Trash2 className="size-4" />
                </button>
            )}
        </div>
    );
}

function HubExpenseRowIcon({ icon, imageUrl, title }: { icon: string; imageUrl?: string; title: string }) {
    if (imageUrl) {
        return (
            <div className="hub-expense-row-icon hub-expense-row-photo size-12 shrink-0 overflow-hidden p-0 lg:size-14">
                <img src={imageUrl} alt={title} className="size-full object-cover" loading="lazy" />
            </div>
        );
    }

    return (
        <div className="hub-expense-row-icon flex size-12 shrink-0 items-center justify-center text-xl lg:size-14 lg:text-2xl">
            {icon}
        </div>
    );
}

function HubExpenseRow({
    icon,
    imageUrl,
    title,
    subtitle,
    amount,
    date,
    href,
    editHref,
    deleteHref,
    actionHref,
    actionLabel,
    actionDisabled,
    actionDisabledReason,
    ticketHref,
    ticketLabel,
}: HubExpenseListItem) {
    const hasActions = Boolean(editHref || deleteHref || actionHref || ticketHref);
    const hasLabelAction = Boolean(actionHref || ticketHref);

    return (
        <div
            className={cn(
                'hub-expense-row flex gap-2 rounded-xl py-2 transition lg:gap-3 lg:px-1 lg:py-2.5',
                hasLabelAction ? 'items-start sm:items-center' : 'items-center',
            )}
        >
            <Link href={href} prefetch className="flex min-w-0 flex-1 items-center gap-3.5 lg:gap-4">
                <HubExpenseRowIcon icon={icon} imageUrl={imageUrl} title={title} />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] leading-tight font-semibold text-foreground lg:text-base">{title}</p>
                    <p className="mt-0.5 truncate text-[13px] text-muted-foreground lg:text-sm">{subtitle}</p>
                    {hasLabelAction ? (
                        <p className="mt-1 text-[12px] leading-snug text-muted-foreground sm:hidden">
                            {amount} · {date}
                        </p>
                    ) : null}
                </div>
            </Link>
            <div
                className={cn(
                    'relative z-10 flex shrink-0 gap-2 sm:gap-3',
                    hasLabelAction ? 'flex-col items-end pt-0.5 sm:flex-row sm:items-center sm:pt-0' : 'items-center',
                )}
            >
                <div className={cn('text-right', hasLabelAction && 'hidden sm:block')}>
                    <p className="text-[15px] leading-tight font-semibold text-foreground lg:text-base">{amount}</p>
                    <p className="mt-0.5 text-[12px] text-muted-foreground lg:text-sm">{date}</p>
                </div>
                {hasActions && (
                    <HubExpenseRowActions
                        editHref={editHref}
                        deleteHref={deleteHref}
                        actionHref={actionHref}
                        actionLabel={actionLabel}
                        actionDisabled={actionDisabled}
                        actionDisabledReason={actionDisabledReason}
                        ticketHref={ticketHref}
                        ticketLabel={ticketLabel}
                    />
                )}
            </div>
        </div>
    );
}

export function HubExpenseView({
    title,
    periodLabel,
    summaryValue,
    summaryEmoji = '💰',
    items,
    emptyMessage = 'Belum ada data.',
    createHref,
    createLabel = 'Tambah',
    createPlacement = 'sheet-only',
    paginationLinks,
    backHref = '/dashboard',
    backLabel = 'Kembali ke dashboard',
}: HubExpenseViewProps) {
    const summaryDisplay = typeof summaryValue === 'number' ? summaryValue.toLocaleString('id-ID') : summaryValue;
    const hasCreate = Boolean(createHref);
    const isSheetOnlyPlacement = createPlacement === 'sheet-only';
    const showCreateIconBesideTitle = hasCreate && !isSheetOnlyPlacement;
    const showCreateBelowDonut = hasCreate;
    const showCreateAboveList = hasCreate && !isSheetOnlyPlacement;

    return (
        <div className="flex h-full min-h-0 flex-col lg:flex-row-reverse lg:overflow-hidden">
            <div className="hub-expense-hero safe-x relative shrink-0 px-5 pb-2 pt-4 sm:px-6 sm:pt-5 lg:flex lg:w-[min(100%,22rem)] lg:flex-col lg:justify-center lg:border-l lg:border-slate-200 lg:px-8 lg:py-8 dark:lg:border-white/10 xl:w-80">
                <Link
                    href={backHref}
                    prefetch
                    className="absolute top-4 left-4 flex size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted lg:hidden"
                    aria-label={backLabel}
                >
                    <ChevronLeft className="size-5" />
                </Link>

                <div className="flex items-start justify-between gap-3 pr-1 pl-10 sm:pl-11 lg:pl-0">
                    <div className="min-w-0">
                        <h1 className="text-[22px] leading-tight font-bold text-foreground sm:text-2xl lg:text-3xl">{title}</h1>
                        {periodLabel ? (
                            <p className="mt-0.5 text-sm text-muted-foreground sm:text-[15px] lg:text-base">{periodLabel}</p>
                        ) : null}
                    </div>
                    <div className="flex shrink-0 items-center gap-2 pt-0.5">
                        {showCreateIconBesideTitle && (
                            <Link
                                href={createHref!}
                                prefetch
                                className="hub-expense-action-btn hub-expense-action-primary lg:hidden"
                                aria-label={createLabel}
                            >
                                <Plus className="size-5" />
                            </Link>
                        )}
                        <div className="flex size-9 items-center justify-center text-muted-foreground lg:size-10" aria-hidden>
                            <PieChart className="size-[22px] stroke-[1.5]" />
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex justify-center sm:mt-6 lg:mt-8">
                    <HubExpenseDonut value={summaryDisplay} emoji={summaryEmoji} />
                </div>

                {showCreateBelowDonut && (
                    <Link
                        href={createHref!}
                        prefetch
                        className={
                            isSheetOnlyPlacement
                                ? 'hub-expense-create-btn mt-6 inline-flex w-full'
                                : 'hub-expense-create-btn mt-6 hidden w-full lg:inline-flex'
                        }
                    >
                        <Plus className="size-4 shrink-0" />
                        {createLabel}
                    </Link>
                )}
            </div>

            <div className="hub-expense-sheet safe-x flex min-h-0 flex-1 flex-col px-5 pt-3 pb-6 sm:px-6 lg:rounded-none lg:px-8 lg:py-6">
                <div className="hub-expense-sheet-handle mx-auto mb-4 h-1 w-10 shrink-0 rounded-full lg:hidden" aria-hidden />

                {showCreateAboveList && (
                    <Link
                        href={createHref!}
                        prefetch
                        className="hub-expense-create-btn mb-4 w-full shrink-0 lg:hidden"
                    >
                        <Plus className="size-4 shrink-0" />
                        {createLabel}
                    </Link>
                )}

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch] lg:pr-1">
                    <FlashAlert />
                    {items.length === 0 ? (
                        <p className="py-10 text-center text-sm text-muted-foreground lg:text-base">{emptyMessage}</p>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            {items.map((item) => (
                                <HubExpenseRow key={item.id} {...item} />
                            ))}
                        </div>
                    )}
                </div>

                {paginationLinks && paginationLinks.length > 0 && (
                    <div className="mt-3 shrink-0 border-t border-slate-200 pt-3 dark:border-white/10">
                        <PaginationLinks links={paginationLinks} />
                    </div>
                )}
            </div>
        </div>
    );
}

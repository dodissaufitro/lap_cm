import { FlashAlert } from '@/components/crud/flash-alert';
import { PaginationLinks } from '@/components/crud/pagination-links';
import { type HubExpenseListItem, type HubExpenseViewProps } from '@/types/hub-expense';
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
                <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="22" />
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
                <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-[2.75rem] lg:text-5xl">{value}</p>
            </div>
        </div>
    );
}

function HubExpenseRowActions({ editHref, deleteHref }: { editHref?: string; deleteHref?: string }) {
    if (!editHref && !deleteHref) {
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
        <div className="flex shrink-0 items-center gap-1.5">
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

function HubExpenseRow({ icon, title, subtitle, amount, date, href, editHref, deleteHref }: HubExpenseListItem) {
    const hasActions = Boolean(editHref || deleteHref);

    return (
        <div className="hub-expense-row flex items-center gap-2 rounded-xl py-2 transition lg:gap-3 lg:px-1 lg:py-2.5">
            <Link href={href} prefetch className="flex min-w-0 flex-1 items-center gap-3.5 lg:gap-4">
                <div className="hub-expense-row-icon flex size-12 shrink-0 items-center justify-center text-xl lg:size-14 lg:text-2xl">
                    {icon}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold leading-tight text-white lg:text-base">{title}</p>
                    <p className="mt-0.5 truncate text-[13px] text-[#8b90b8] lg:text-sm">{subtitle}</p>
                </div>
            </Link>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <div className="text-right">
                    <p className="text-[15px] font-semibold leading-tight text-white lg:text-base">{amount}</p>
                    <p className="mt-0.5 text-[12px] text-[#8b90b8] lg:text-sm">{date}</p>
                </div>
                {hasActions && <HubExpenseRowActions editHref={editHref} deleteHref={deleteHref} />}
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
}: HubExpenseViewProps) {
    const summaryDisplay = typeof summaryValue === 'number' ? summaryValue.toLocaleString('id-ID') : summaryValue;
    const hasCreate = Boolean(createHref);
    const isSheetOnlyPlacement = createPlacement === 'sheet-only';
    const showCreateIconBesideTitle = hasCreate && !isSheetOnlyPlacement;
    const showCreateBelowDonut = hasCreate;
    const showCreateAboveList = hasCreate && !isSheetOnlyPlacement;

    return (
        <div className="flex h-full min-h-0 flex-col lg:flex-row-reverse lg:overflow-hidden">
            <div className="hub-expense-hero safe-x relative shrink-0 px-5 pb-2 pt-4 sm:px-6 sm:pt-5 lg:flex lg:w-[min(100%,22rem)] lg:flex-col lg:justify-center lg:border-l lg:border-white/10 lg:px-8 lg:py-8 xl:w-80">
                <Link
                    href="/dashboard"
                    prefetch
                    className="absolute top-4 left-4 flex size-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 sm:left-5 lg:hidden"
                    aria-label="Kembali ke dashboard"
                >
                    <ChevronLeft className="size-5" />
                </Link>

                <div className="flex items-start justify-between gap-3 pr-1 pl-10 sm:pl-11 lg:pl-0">
                    <div className="min-w-0">
                        <h1 className="text-[22px] leading-tight font-bold text-white sm:text-2xl lg:text-3xl">{title}</h1>
                        {periodLabel ? (
                            <p className="mt-0.5 text-sm text-[#8b90b8] sm:text-[15px] lg:text-base">{periodLabel}</p>
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
                        <div className="flex size-9 items-center justify-center text-white/90 lg:size-10" aria-hidden>
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
                <div className="mx-auto mb-4 h-1 w-10 shrink-0 rounded-full bg-white/20 lg:hidden" aria-hidden />

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
                        <p className="py-10 text-center text-sm text-[#8b90b8] lg:text-base">{emptyMessage}</p>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {items.map((item) => (
                                <HubExpenseRow key={item.id} {...item} />
                            ))}
                        </div>
                    )}
                </div>

                {paginationLinks && paginationLinks.length > 0 && (
                    <div className="mt-3 shrink-0 border-t border-white/10 pt-3 [&_a]:text-[#8b90b8] [&_span]:text-white">
                        <PaginationLinks links={paginationLinks} variant="dark" />
                    </div>
                )}
            </div>
        </div>
    );
}

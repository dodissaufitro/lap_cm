export interface HubExpenseListItem {
    id: number;
    href: string;
    icon: string;
    title: string;
    subtitle: string;
    amount: string;
    date: string;
    editHref?: string;
    deleteHref?: string;
}

import { type PaginatedLink } from '@/types/crud';

export interface HubExpenseViewProps {
    title: string;
    periodLabel?: string;
    summaryValue: string | number;
    summaryEmoji?: string;
    items: HubExpenseListItem[];
    emptyMessage?: string;
    createHref?: string;
    createLabel?: string;
    /**
     * `sheet-only`: satu tombol di bawah ikon donut saja (tanpa di header/atas daftar).
     * `everywhere`: ikon + di header (HP), atas daftar (HP), bawah ikon (web).
     */
    /** @default sheet-only */
    createPlacement?: 'everywhere' | 'sheet-only';
    paginationLinks?: PaginatedLink[];
}

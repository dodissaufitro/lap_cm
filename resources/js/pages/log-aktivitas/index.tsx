import { HubExpenseView } from '@/components/hub/expense/hub-expense-view';
import HubModuleLayout from '@/layouts/hub-module-layout';
import { formatDatetime } from '@/lib/datetime';
import { type HubExpenseListItem } from '@/types/hub-expense';
import { type Paginated } from '@/types/crud';
import { Head } from '@inertiajs/react';

interface LogAktivitas {
    id: number;
    aktivitas: string;
    created_at: string;
    user?: { name: string };
}

interface Props {
    items: Paginated<LogAktivitas>;
    filters: { search: string };
}

export default function LogAktivitasIndex({ items }: Props) {
    const listItems: HubExpenseListItem[] = items.data.map((item) => ({
        id: item.id,
        href: route('log-aktivitas.show', item.id),
        icon: '📜',
        title: item.aktivitas.length > 48 ? `${item.aktivitas.slice(0, 48)}…` : item.aktivitas,
        subtitle: item.user?.name ?? 'Sistem',
        amount: 'Log',
        date: formatDatetime(item.created_at),
    }));

    return (
        <HubModuleLayout>
            <Head title="Log Aktivitas" />
            <HubExpenseView
                title="Log Aktivitas"
                summaryValue={items.total}
                summaryEmoji="📜"
                items={listItems}
                emptyMessage="Belum ada log aktivitas."
                paginationLinks={items.links}
            />
        </HubModuleLayout>
    );
}

import { HubExpenseView } from '@/components/hub/expense/hub-expense-view';
import HubModuleLayout from '@/layouts/hub-module-layout';
import { hubExpenseRowDate } from '@/lib/hub-expense';
import { lampiranRowPermissions } from '@/lib/hub-expense-permissions';
import { type HubExpenseListItem } from '@/types/hub-expense';
import { type Paginated } from '@/types/crud';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface Lampiran {
    id: number;
    nama_file: string;
    tipe_file: string | null;
    ukuran_file: number | null;
    created_at?: string;
    pengajuan?: { nomor_pengajuan: string; user_id?: number; user?: { name: string } };
}

interface Props {
    items: Paginated<Lampiran>;
    filters: { search: string };
    canCreate: boolean;
}

function formatSize(bytes: number | null): string {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function LampiransIndex({ items, canCreate }: Props) {
    const { auth } = usePage<SharedData>().props;

    const listItems: HubExpenseListItem[] = items.data.map((item) => ({
        id: item.id,
        href: route('lampirans.show', item.id),
        icon: '📎',
        title: item.nama_file,
        subtitle: item.pengajuan?.nomor_pengajuan ?? item.pengajuan?.user?.name ?? 'Lampiran pengajuan',
        amount: formatSize(item.ukuran_file),
        date: hubExpenseRowDate(item.created_at ?? null),
        ...lampiranRowPermissions(item, auth.user),
    }));

    return (
        <HubModuleLayout>
            <Head title="Lampiran" />
            <HubExpenseView
                title="Lampiran"
                summaryValue={items.total}
                summaryEmoji="📎"
                items={listItems}
                emptyMessage="Belum ada lampiran."
                createHref={canCreate ? route('lampirans.create') : undefined}
                createLabel="Unggah Lampiran"
                paginationLinks={items.links}
            />
        </HubModuleLayout>
    );
}

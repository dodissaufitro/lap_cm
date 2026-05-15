import { HubExpenseView } from '@/components/hub/expense/hub-expense-view';
import HubModuleLayout from '@/layouts/hub-module-layout';
import { hubExpenseRowDate } from '@/lib/hub-expense';
import { storageUrl } from '@/lib/storage-url';
import { type HubExpenseListItem } from '@/types/hub-expense';
import { type Paginated } from '@/types/crud';
import { Head } from '@inertiajs/react';

interface Sarana {
    id: number;
    nama_sarana: string;
    kode_sarana: string;
    lokasi: string | null;
    status: string;
    foto?: string | null;
    created_at?: string;
    kategori?: { id: number; nama_kategori: string };
}

interface Props {
    items: Paginated<Sarana>;
    filters: { search: string };
    canManage: boolean;
}

const statusLabels: Record<string, string> = {
    tersedia: 'Tersedia',
    maintenance: 'Maintenance',
    tidak_aktif: 'Tidak Aktif',
};

export default function SaranasIndex({ items, canManage }: Props) {
    const listItems: HubExpenseListItem[] = items.data.map((item) => ({
        id: item.id,
        href: route('saranas.show', item.id),
        icon: '🏢',
        imageUrl: storageUrl(item.foto),
        title: item.nama_sarana,
        subtitle: item.kategori?.nama_kategori ?? item.lokasi ?? 'Fasilitas sarana',
        amount: statusLabels[item.status] ?? item.status,
        date: hubExpenseRowDate(item.created_at ?? null),
        ...(canManage
            ? {
                  editHref: route('saranas.edit', item.id),
                  deleteHref: route('saranas.destroy', item.id),
              }
            : {}),
    }));

    return (
        <HubModuleLayout>
            <Head title="Sarana" />
            <HubExpenseView
                title="Sarana"
                summaryValue={items.total}
                summaryEmoji="🏢"
                items={listItems}
                emptyMessage="Belum ada data sarana."
                createHref={canManage ? route('saranas.create') : undefined}
                createLabel="Tambah Sarana"
                paginationLinks={items.links}
            />
        </HubModuleLayout>
    );
}

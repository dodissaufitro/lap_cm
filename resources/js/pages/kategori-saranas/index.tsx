import { HubExpenseView } from '@/components/hub/expense/hub-expense-view';
import HubModuleLayout from '@/layouts/hub-module-layout';
import { hubExpenseRowDate } from '@/lib/hub-expense';
import { type HubExpenseListItem } from '@/types/hub-expense';
import { type Paginated } from '@/types/crud';
import { Head } from '@inertiajs/react';

interface KategoriSarana {
    id: number;
    nama_kategori: string;
    deskripsi: string | null;
    created_at?: string;
}

interface Props {
    items: Paginated<KategoriSarana>;
    filters: { search: string };
}

export default function KategoriSaranasIndex({ items }: Props) {
    const listItems: HubExpenseListItem[] = items.data.map((item) => ({
        id: item.id,
        href: route('kategori-saranas.show', item.id),
        icon: '📁',
        title: item.nama_kategori,
        subtitle: item.deskripsi ?? 'Kelompok jenis sarana',
        amount: 'Kategori',
        date: hubExpenseRowDate(item.created_at ?? null),
        editHref: route('kategori-saranas.edit', item.id),
        deleteHref: route('kategori-saranas.destroy', item.id),
    }));

    return (
        <HubModuleLayout>
            <Head title="Kategori" />
            <HubExpenseView
                title="Kategori"
                summaryValue={items.total}
                summaryEmoji="📁"
                items={listItems}
                emptyMessage="Belum ada kategori sarana."
                createHref={route('kategori-saranas.create')}
                createLabel="Tambah Kategori"
                paginationLinks={items.links}
            />
        </HubModuleLayout>
    );
}

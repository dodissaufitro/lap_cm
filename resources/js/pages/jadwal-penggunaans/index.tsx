import { HubExpenseView } from '@/components/hub/expense/hub-expense-view';
import HubModuleLayout from '@/layouts/hub-module-layout';
import { formatDatetime } from '@/lib/datetime';
import { type HubExpenseListItem } from '@/types/hub-expense';
import { type Paginated, type SelectOption } from '@/types/crud';
import { Head } from '@inertiajs/react';

interface Jadwal {
    id: number;
    mulai: string;
    selesai: string;
    status: string;
    sarana?: { nama_sarana: string };
    pengajuan?: { nomor_pengajuan: string; user?: { name: string } };
}

interface Props {
    items: Paginated<Jadwal>;
    filters: { search: string; status: string };
    statusOptions: SelectOption[];
    canManage: boolean;
}

const statusLabels: Record<string, string> = {
    terjadwal: 'Terjadwal',
    berlangsung: 'Berlangsung',
    selesai: 'Selesai',
    dibatalkan: 'Dibatalkan',
};

export default function JadwalPenggunaansIndex({ items, canManage }: Props) {
    const listItems: HubExpenseListItem[] = items.data.map((item) => ({
        id: item.id,
        href: route('jadwal-penggunaans.show', item.id),
        icon: '📅',
        title: item.sarana?.nama_sarana ?? item.pengajuan?.nomor_pengajuan ?? `Jadwal #${item.id}`,
        subtitle: item.pengajuan?.user?.name ?? item.pengajuan?.nomor_pengajuan ?? 'Jadwal pemakaian sarana',
        amount: statusLabels[item.status] ?? item.status,
        date: formatDatetime(item.mulai),
        ...(canManage
            ? {
                  editHref: route('jadwal-penggunaans.edit', item.id),
                  deleteHref: route('jadwal-penggunaans.destroy', item.id),
              }
            : {}),
    }));

    return (
        <HubModuleLayout>
            <Head title="Jadwal Penggunaan" />
            <HubExpenseView
                title="Jadwal"
                summaryValue={items.total}
                summaryEmoji="📅"
                items={listItems}
                emptyMessage="Belum ada jadwal penggunaan."
                createHref={canManage ? route('jadwal-penggunaans.create') : undefined}
                createLabel="Tambah Jadwal"
                paginationLinks={items.links}
            />
        </HubModuleLayout>
    );
}

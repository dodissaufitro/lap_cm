import { HubExpenseView } from '@/components/hub/expense/hub-expense-view';
import HubModuleLayout from '@/layouts/hub-module-layout';
import { hubExpenseRowDate } from '@/lib/hub-expense';
import { pengajuanRowPermissions } from '@/lib/hub-expense-permissions';
import { type HubExpenseListItem } from '@/types/hub-expense';
import { type Paginated, type SelectOption } from '@/types/crud';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface Pengajuan {
    id: number;
    nomor_pengajuan: string;
    tanggal_pengajuan: string;
    status: string;
    user?: { id: number; name: string };
    sarana?: { id: number; nama_sarana: string; kode_sarana: string };
}

interface Props {
    items: Paginated<Pengajuan>;
    filters: { search: string; status: string };
    statusOptions: SelectOption[];
    canCreate: boolean;
}

const statusLabelMap: Record<string, string> = {
    draft: 'Draft',
    diajukan: 'Diajukan',
    diproses: 'Diproses',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
    selesai: 'Selesai',
    dibatalkan: 'Dibatalkan',
};

export default function PengajuansIndex({ items, canCreate }: Props) {
    const { auth } = usePage<SharedData>().props;

    const listItems: HubExpenseListItem[] = items.data.map((item) => ({
        id: item.id,
        href: route('pengajuans.show', item.id),
        icon: '📋',
        title: item.nomor_pengajuan,
        subtitle: item.sarana?.nama_sarana ?? item.user?.name ?? 'Pengajuan sarana',
        amount: statusLabelMap[item.status] ?? item.status,
        date: hubExpenseRowDate(item.tanggal_pengajuan),
        ...pengajuanRowPermissions(item, auth.user),
    }));

    return (
        <HubModuleLayout>
            <Head title="Pengajuan" />
            <HubExpenseView
                title="Pengajuan"
                summaryValue={items.total}
                summaryEmoji="📋"
                items={listItems}
                emptyMessage="Belum ada data pengajuan."
                createHref={canCreate ? route('pengajuans.create') : undefined}
                createLabel="Tambah Pengajuan"
                paginationLinks={items.links}
            />
        </HubModuleLayout>
    );
}

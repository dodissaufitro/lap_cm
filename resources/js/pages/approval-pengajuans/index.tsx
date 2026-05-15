import { HubExpenseView } from '@/components/hub/expense/hub-expense-view';
import HubModuleLayout from '@/layouts/hub-module-layout';
import { hubExpenseRowDate } from '@/lib/hub-expense';
import { approvalRowPermissions } from '@/lib/hub-expense-permissions';
import { type HubExpenseListItem } from '@/types/hub-expense';
import { type Paginated, type SelectOption } from '@/types/crud';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface Approval {
    id: number;
    level_approval: number;
    status: string;
    created_at?: string;
    pengajuan?: {
        id: number;
        nomor_pengajuan: string;
        sarana?: { nama_sarana: string };
        user?: { name: string };
    };
    approver?: { id: number; name: string };
}

interface Props {
    items: Paginated<Approval>;
    filters: { status: string };
    statusOptions: SelectOption[];
    canCreate: boolean;
}

const statusLabels: Record<string, string> = {
    pending: 'Menunggu',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
    revisi: 'Revisi',
};

export default function ApprovalPengajuansIndex({ items, canCreate }: Props) {
    const { auth } = usePage<SharedData>().props;

    const listItems: HubExpenseListItem[] = items.data.map((item) => ({
        id: item.id,
        href: route('approval-pengajuans.show', item.id),
        icon: '✅',
        title: item.pengajuan?.nomor_pengajuan ?? `Persetujuan #${item.id}`,
        subtitle: item.pengajuan?.sarana?.nama_sarana ?? item.pengajuan?.user?.name ?? 'Persetujuan pengajuan',
        amount: statusLabels[item.status] ?? item.status,
        date: hubExpenseRowDate(item.created_at ?? null),
        ...approvalRowPermissions(item, auth.user),
    }));

    return (
        <HubModuleLayout>
            <Head title="Persetujuan" />
            <HubExpenseView
                title="Persetujuan"
                summaryValue={items.total}
                summaryEmoji="✅"
                items={listItems}
                emptyMessage="Belum ada data persetujuan."
                createHref={canCreate ? route('approval-pengajuans.create') : undefined}
                createLabel="Tambah Persetujuan"
                paginationLinks={items.links}
            />
        </HubModuleLayout>
    );
}

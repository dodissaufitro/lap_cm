import { HubExpenseView } from '@/components/hub/expense/hub-expense-view';
import HubModuleLayout from '@/layouts/hub-module-layout';
import { hubExpenseRowDate } from '@/lib/hub-expense';
import { type HubExpenseListItem } from '@/types/hub-expense';
import { type Paginated } from '@/types/crud';
import { Head } from '@inertiajs/react';

interface PengajuanRow {
    id: number;
    nomor_pengajuan: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    checked_in_at: string;
    sarana?: { id: number; nama_sarana: string; kode_sarana: string };
}

interface Props {
    items: Paginated<PengajuanRow>;
}

export default function ProsesCheckOutIndex({ items }: Props) {
    const listItems: HubExpenseListItem[] = items.data.map((item) => ({
        id: item.id,
        href: route('pengajuans.show', item.id),
        icon: '📤',
        title: item.nomor_pengajuan,
        subtitle: item.sarana?.nama_sarana ?? 'Sarana',
        amount: 'Selesai setelah check out',
        date: hubExpenseRowDate(item.checked_in_at),
        actionHref: route('proses.check-out.store', { pengajuan: item.id }),
        actionLabel: 'Check Out',
    }));

    return (
        <HubModuleLayout>
            <Head title="Check Out" />
            <HubExpenseView
                title="Check Out"
                periodLabel="Setelah check out, status pengajuan otomatis menjadi selesai"
                summaryValue={items.total}
                summaryEmoji="📤"
                items={listItems}
                emptyMessage="Tidak ada pengajuan yang menunggu check out."
                paginationLinks={items.links}
                backHref="/proses"
                backLabel="Kembali ke Proses"
            />
        </HubModuleLayout>
    );
}

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
    can_check_in: boolean;
    has_checked_in: boolean;
    can_print_ticket: boolean;
    ticket_url: string | null;
    status_label: string;
    checked_in_at: string | null;
    sarana?: { id: number; nama_sarana: string; kode_sarana: string };
}

interface Props {
    items: Paginated<PengajuanRow>;
}

function mapCheckInRow(item: PengajuanRow): HubExpenseListItem {
    const base = {
        id: item.id,
        href: route('pengajuans.show', item.id),
        icon: item.has_checked_in ? '🎫' : '✅',
        title: item.nomor_pengajuan,
        subtitle: item.sarana?.nama_sarana ?? 'Sarana',
        amount: item.status_label,
        date: hubExpenseRowDate(item.has_checked_in ? item.checked_in_at ?? item.tanggal_mulai : item.tanggal_mulai),
    };

    if (item.has_checked_in && item.can_print_ticket && item.ticket_url) {
        return {
            ...base,
            ticketHref: item.ticket_url,
            ticketLabel: 'Cetak Tiket',
        };
    }

    return {
        ...base,
        actionHref: route('proses.check-in.store', { pengajuan: item.id }),
        actionLabel: 'Check In',
        actionDisabled: !item.can_check_in,
        actionDisabledReason: 'Check in hanya pada tanggal mulai yang sama (hari, bulan, tahun)',
    };
}

export default function ProsesCheckInIndex({ items }: Props) {
    const listItems = items.data.map(mapCheckInRow);

    return (
        <HubModuleLayout>
            <Head title="Check In" />
            <HubExpenseView
                title="Check In"
                periodLabel="Setelah check in, unduh tiket dengan tombol Cetak Tiket. Check out di menu terpisah."
                summaryValue={items.total}
                summaryEmoji="📥"
                items={listItems}
                emptyMessage="Tidak ada pengajuan disetujui untuk proses check in."
                paginationLinks={items.links}
                backHref="/proses"
                backLabel="Kembali ke Proses"
            />
        </HubModuleLayout>
    );
}

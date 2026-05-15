import { ProsesMenuCards } from '@/components/proses-menu-cards';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface Props {
    counts: {
        checkIn: number;
        checkOut: number;
    };
}

export default function ProsesIndex({ counts }: Props) {
    return (
        <AppLayout>
            <Head title="Proses" />
            <ProsesMenuCards counts={counts} />
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type DashboardPageProps } from '@/types/dashboard';

export default function Dashboard(_props: DashboardPageProps) {
    return (
        <AppLayout>
            <Head title="Dashboard" />
        </AppLayout>
    );
}

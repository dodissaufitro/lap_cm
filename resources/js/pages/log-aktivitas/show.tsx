import { FlashAlert } from '@/components/crud/flash-alert';
import { PageHeader } from '@/components/crud/page-header';
import AppLayout from '@/layouts/app-layout';
import { formatDatetime } from '@/lib/datetime';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface LogAktivitas {
    id: number;
    aktivitas: string;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    user?: { name: string; email: string };
}

interface Props {
    item: LogAktivitas;
}

export default function LogAktivitasShow({ item }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Log Aktivitas', href: '/log-aktivitas' },
        { title: 'Detail', href: route('log-aktivitas.show', item.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Log Aktivitas" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader title="Detail Log Aktivitas" />

                <FlashAlert />

                <div className="hub-surface p-6">
                    <dl className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm text-muted-foreground">Waktu</dt>
                            <dd className="mt-1">{formatDatetime(item.created_at)}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Pengguna</dt>
                            <dd className="mt-1">
                                {item.user ? `${item.user.name} (${item.user.email})` : 'Sistem'}
                            </dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm text-muted-foreground">Aktivitas</dt>
                            <dd className="mt-1 whitespace-pre-wrap">{item.aktivitas}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Alamat IP</dt>
                            <dd className="mt-1 font-mono text-sm">{item.ip_address ?? '-'}</dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm text-muted-foreground">User Agent</dt>
                            <dd className="mt-1 break-all text-sm text-muted-foreground">{item.user_agent ?? '-'}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </AppLayout>
    );
}

import { DeleteButton } from '@/components/crud/delete-button';
import { FlashAlert } from '@/components/crud/flash-alert';
import { PageHeader } from '@/components/crud/page-header';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/datetime';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: string;
    role_label?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    item: UserItem;
}

export default function UsersShow({ item }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengguna', href: '/users' },
        { title: item.name, href: route('users.show', item.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={item.name} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title={item.name}
                    actions={
                        <>
                            <Button variant="secondary" asChild>
                                <Link href={route('users.edit', item.id)}>
                                    <Pencil className="size-4" />
                                    Edit
                                </Link>
                            </Button>
                            <DeleteButton href={route('users.destroy', item.id)} />
                        </>
                    }
                />

                <FlashAlert />

                <div className="hub-surface p-6">
                    <dl className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <dt className="text-sm text-muted-foreground">Email</dt>
                            <dd className="mt-1 font-medium">{item.email}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Peran</dt>
                            <dd className="mt-1 font-medium">{item.role_label ?? item.role}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Status</dt>
                            <dd className="mt-1">{item.is_active ? 'Aktif' : 'Nonaktif'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Dibuat</dt>
                            <dd className="mt-1">{formatDate(item.created_at)}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Diperbarui</dt>
                            <dd className="mt-1">{formatDate(item.updated_at)}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </AppLayout>
    );
}

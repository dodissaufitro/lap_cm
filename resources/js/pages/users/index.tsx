import { HubExpenseView } from '@/components/hub/expense/hub-expense-view';
import HubModuleLayout from '@/layouts/hub-module-layout';
import { hubExpenseRowDate } from '@/lib/hub-expense';
import { type HubExpenseListItem } from '@/types/hub-expense';
import { type Paginated, type SelectOption } from '@/types/crud';
import { Head } from '@inertiajs/react';

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: string;
    role_label?: string;
    is_active: boolean;
    created_at?: string;
}

interface Props {
    items: Paginated<UserItem>;
    filters: { search: string; role: string };
    roleOptions: SelectOption[];
}

export default function UsersIndex({ items }: Props) {
    const listItems: HubExpenseListItem[] = items.data.map((item) => ({
        id: item.id,
        href: route('users.show', item.id),
        icon: '👤',
        title: item.name,
        subtitle: item.email,
        amount: item.role_label ?? item.role,
        date: hubExpenseRowDate(item.created_at ?? null),
        editHref: route('users.edit', item.id),
        deleteHref: route('users.destroy', item.id),
    }));

    return (
        <HubModuleLayout>
            <Head title="Pengguna" />
            <HubExpenseView
                title="Pengguna"
                summaryValue={items.total}
                summaryEmoji="👤"
                items={listItems}
                emptyMessage="Belum ada pengguna."
                createHref={route('users.create')}
                createLabel="Tambah Pengguna"
                paginationLinks={items.links}
            />
        </HubModuleLayout>
    );
}

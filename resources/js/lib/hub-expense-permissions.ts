import { type User } from '@/types';

const pengajuanEditableStatuses = ['draft', 'diajukan', 'diproses'] as const;
const pengajuanDeletableStatuses = ['draft', 'diajukan'] as const;

export function pengajuanRowPermissions(
    item: { id: number; status: string; user?: { id: number } },
    user: User,
): { editHref?: string; deleteHref?: string } {
    const isOwner = item.user?.id === user.id;

    if (user.role === 'admin') {
        return {
            editHref: route('pengajuans.edit', item.id),
            deleteHref: route('pengajuans.destroy', item.id),
        };
    }

    if (user.role === 'approver') {
        return {};
    }

    if (!isOwner) {
        return {};
    }

    const editHref = pengajuanEditableStatuses.includes(item.status as (typeof pengajuanEditableStatuses)[number])
        ? route('pengajuans.edit', item.id)
        : undefined;
    const deleteHref = pengajuanDeletableStatuses.includes(item.status as (typeof pengajuanDeletableStatuses)[number])
        ? route('pengajuans.destroy', item.id)
        : undefined;

    return { editHref, deleteHref };
}

export function approvalRowPermissions(
    item: { id: number; approver?: { id: number } },
    user: User,
): { editHref?: string; deleteHref?: string } {
    if (user.role === 'admin') {
        return {
            editHref: route('approval-pengajuans.edit', item.id),
            deleteHref: route('approval-pengajuans.destroy', item.id),
        };
    }

    if (user.role === 'approver' && item.approver?.id === user.id) {
        return { editHref: route('approval-pengajuans.edit', item.id) };
    }

    return {};
}

export function lampiranRowPermissions(
    item: { id: number; pengajuan?: { user_id?: number } },
    user: User,
): { deleteHref?: string } {
    if (user.role === 'admin') {
        return { deleteHref: route('lampirans.destroy', item.id) };
    }

    if (user.role === 'pemohon' && item.pengajuan?.user_id === user.id) {
        return { deleteHref: route('lampirans.destroy', item.id) };
    }

    return {};
}

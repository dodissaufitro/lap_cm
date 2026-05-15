import { DeleteButton } from '@/components/crud/delete-button';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Eye, Pencil } from 'lucide-react';

interface TableActionsProps {
    showHref: string;
    editHref?: string;
    deleteHref?: string;
}

export function TableActions({ showHref, editHref, deleteHref }: TableActionsProps) {
    return (
        <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link href={showHref}>
                    <Eye className="size-4" />
                    Lihat
                </Link>
            </Button>
            {editHref && (
                <Button variant="secondary" size="sm" asChild>
                    <Link href={editHref}>
                        <Pencil className="size-4" />
                        Edit
                    </Link>
                </Button>
            )}
            {deleteHref && <DeleteButton href={deleteHref} />}
        </div>
    );
}

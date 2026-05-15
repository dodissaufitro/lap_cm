import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
    href: string;
    label?: string;
}

export function DeleteButton({ href, label = 'Hapus' }: DeleteButtonProps) {
    const handleDelete = () => {
        if (confirm('Yakin ingin menghapus data ini?')) {
            router.delete(href);
        }
    };

    return (
        <Button type="button" variant="destructive" size="sm" className="shadow-sm ring-1 ring-destructive/30" onClick={handleDelete}>
            <Trash2 className="size-4" />
            {label}
        </Button>
    );
}

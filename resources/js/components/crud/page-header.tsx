import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    createHref?: string;
    createLabel?: string;
    actions?: ReactNode;
}

export function PageHeader({ title, description, createHref, createLabel = 'Tambah', actions }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
                {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            <div className="flex flex-wrap gap-2 [&_button]:shadow-sm [&_a]:shadow-sm">
                {actions}
                {createHref && (
                    <Button asChild className="shadow-sm">
                        <Link href={createHref}>
                            <Plus className="size-4" />
                            {createLabel}
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
}


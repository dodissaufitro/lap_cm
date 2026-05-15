import { type PaginatedLink } from '@/types/crud';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export function PaginationLinks({
    links,
    variant = 'default',
}: {
    links: PaginatedLink[];
    variant?: 'default' | 'dark';
}) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav className="flex flex-wrap justify-center gap-1 pt-4">
            {links.map((link, i) =>
                link.url ? (
                    <Link
                        key={`${link.label}-${i}`}
                        href={link.url}
                        preserveScroll
                        className={cn(
                            'inline-flex min-w-9 items-center justify-center rounded-lg border px-3 py-1.5 text-sm transition',
                            variant === 'dark'
                                ? link.active
                                    ? 'border-white/30 bg-white/15 text-white'
                                    : 'border-white/10 bg-white/5 text-[#8b90b8] hover:bg-white/10 hover:text-white'
                                : link.active
                                  ? 'border-primary bg-primary text-primary-foreground dark:border-white/30 dark:bg-white/15 dark:text-white'
                                  : 'border-border bg-background hover:bg-muted dark:border-white/10 dark:bg-white/5 dark:text-muted-foreground dark:hover:bg-white/10 dark:hover:text-foreground',
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={`${link.label}-${i}`}
                        className="inline-flex min-w-9 items-center justify-center px-3 py-1.5 text-sm text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </nav>
    );
}

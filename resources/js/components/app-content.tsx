import { SidebarInset } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', className, children, ...props }: AppContentProps) {
    if (variant === 'sidebar') {
        return <SidebarInset className={className} {...props}>{children}</SidebarInset>;
    }

    return (
        <main className={cn('flex w-full min-w-0 flex-1 flex-col', className)} {...props}>
            {children}
        </main>
    );
}

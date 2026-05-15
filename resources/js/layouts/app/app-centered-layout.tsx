import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppTopHeader } from '@/components/app-top-header';
import { NavMenuCards } from '@/components/nav-menu-cards';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';

export default function AppCenteredLayout({
    children,
    breadcrumbs = [],
}: {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}) {
    const { url } = usePage();
    const isDashboard = url.split('?')[0] === '/dashboard';
    const hasPageContent = Boolean(children);

    return (
        <AppShell className="hub-app-bg relative h-dvh max-h-dvh overflow-hidden">
            <div className="relative z-10 flex h-full min-h-0 flex-col">
                <AppTopHeader breadcrumbs={breadcrumbs} showGreeting={isDashboard} />

                {isDashboard ? (
                    <section className="safe-x safe-b flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
                        <NavMenuCards fillScreen />
                    </section>
                ) : (
                    hasPageContent && (
                        <AppContent className="safe-x safe-b min-h-0 w-full flex-1 overflow-y-auto overscroll-y-contain px-4 py-4 sm:px-5 sm:py-5">
                            {children}
                        </AppContent>
                    )
                )}
            </div>
        </AppShell>
    );
}

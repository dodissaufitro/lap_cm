import { GuestTopHeader } from '@/components/guest-top-header';
import { AppShell } from '@/components/app-shell';

interface GuestHubLayoutProps {
    children: React.ReactNode;
}

export default function GuestHubLayout({ children }: GuestHubLayoutProps) {
    return (
        <AppShell className="hub-app-bg relative h-dvh max-h-dvh overflow-hidden">
            <div className="relative z-10 flex h-full min-h-0 flex-col">
                <GuestTopHeader />

                <section className="safe-x safe-b flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
                    {children}
                </section>
            </div>
        </AppShell>
    );
}

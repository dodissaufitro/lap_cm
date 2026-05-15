import { AppShell } from '@/components/app-shell';
import { AppTopHeader } from '@/components/app-top-header';

interface HubModuleLayoutProps {
    children: React.ReactNode;
}

export default function HubModuleLayout({ children }: HubModuleLayoutProps) {
    return (
        <AppShell className="hub-expense-bg relative h-dvh max-h-dvh overflow-hidden text-white lg:hub-app-bg lg:h-auto lg:min-h-dvh lg:max-h-none lg:overflow-y-auto lg:text-foreground">
            <div className="relative z-10 flex h-full min-h-0 flex-col lg:min-h-dvh">
                <AppTopHeader className="hidden lg:block dark:hub-glass-header" />

                <div className="flex min-h-0 flex-1 flex-col lg:safe-x lg:overflow-y-auto lg:overscroll-y-contain lg:px-6 lg:py-6 xl:px-8 xl:py-8">
                    <div className="hub-expense-panel mx-auto flex h-full min-h-0 w-full max-w-6xl flex-1 flex-col overflow-hidden lg:max-h-[calc(100dvh-7.5rem)] lg:min-h-[28rem] xl:max-w-7xl">
                        {children}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}

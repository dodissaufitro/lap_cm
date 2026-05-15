import AppLogo from '@/components/app-logo';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';

interface AppTopHeaderProps {
    breadcrumbs?: BreadcrumbItemType[];
    showGreeting?: boolean;
}

export function AppTopHeader({ breadcrumbs = [], showGreeting = false }: AppTopHeaderProps) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const firstName = auth.user.name.split(' ')[0];

    return (
        <header className={cn('safe-x relative z-20 w-full shrink-0 border-b hub-glass-header')}>
            <div className="flex h-14 w-full items-center justify-between gap-3 sm:h-16 lg:h-[4.5rem]">
                <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-4">
                    <Link href="/dashboard" prefetch className="flex shrink-0 items-center">
                        <AppLogo showTitle={false} imageClassName="h-8 sm:h-9 lg:h-11 xl:h-12" />
                    </Link>
                    {showGreeting && (
                        <div className="min-w-0">
                            <p className="text-xs text-muted-foreground lg:text-sm">Halo,</p>
                            <p className="truncate text-sm font-semibold sm:text-base lg:text-lg xl:text-xl">{firstName}</p>
                        </div>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <ThemeToggle />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label="Notifikasi"
                    >
                        <Bell className="size-5" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="size-10 rounded-full p-1 ring-2 ring-primary/20">
                                <Avatar className="size-8 overflow-hidden rounded-full">
                                    <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                    <AvatarFallback className="rounded-full bg-primary/20 text-primary">
                                        {getInitials(auth.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 border-white/10 bg-card" align="end">
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {breadcrumbs.length > 0 && (
                <div className="w-full border-t border-white/5 py-2.5">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            )}
        </header>
    );
}

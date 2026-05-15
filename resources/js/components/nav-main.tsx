import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage<SharedData>();
    const role = page.props.auth.user.role;

    const visibleItems = items.filter((item) => {
        if (!item.roles?.length) {
            return true;
        }

        return item.roles.includes(role);
    });

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
                {visibleItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={page.url.startsWith(item.url)}>
                            <Link href={item.url} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

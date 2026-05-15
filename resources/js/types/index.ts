import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User | null;
    allowedMenuKeys?: string[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    description?: string;
    icon?: LucideIcon | null;
    accent?: string;
    ring?: string;
    isActive?: boolean;
    roles?: UserRole[];
    menuKey?: string;
}

export interface SharedData {
    name: string;
    appLogoUrl?: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export type UserRole = 'admin' | 'approver' | 'pemohon';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    role_label?: string;
    is_active: boolean;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface DemoUser {
    role: UserRole;
    label: string;
    name: string;
    email: string;
    password: string;
}
